// app/api/webhook/sendgrid/route.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Function to decode quoted-printable text with better UTF-8 handling
function decodeQuotedPrintable(str: string): string {
  // Replace soft line breaks (=\r\n or =\n) with empty string
  str = str.replace(/=(?:\r\n?|\n)/g, "");

  // Replace encoded characters with their decoded values
  return str.replace(/=([0-9A-F]{2})/gi, (_, p1) => {
    try {
      return String.fromCharCode(parseInt(p1, 16));
    } catch (e) {
      console.error("Error decoding hex:", p1, e);
      return "";
    }
  });
}

// Improved attachment processing
interface Attachment {
  filename: string;
  content: Buffer;
  contentType: string;
  size: number;
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace unsafe chars
    .replace(/\.{2,}/g, ".") // Prevent directory traversal
    .substring(0, 255); // Limit length
}

async function processAttachment(
  content: string,
  contentType: string,
  filename: string
): Promise<Attachment | null> {
  try {
    // Validate content type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(contentType)) {
      console.warn(`Unsupported attachment type: ${contentType}`);
      return null;
    }

    // Clean up base64 content
    const cleanContent = content
      .replace(/\s/g, "") // Remove whitespace
      .replace(/[^A-Za-z0-9+/=]/g, ""); // Remove invalid chars

    // Decode content
    const buffer = Buffer.from(cleanContent, "base64");

    // Check size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      console.warn(`Attachment too large: ${buffer.length} bytes`);
      return null;
    }

    return {
      filename: sanitizeFilename(filename),
      content: buffer,
      contentType,
      size: buffer.length,
    };
  } catch (error) {
    console.error("Failed to process attachment:", error);
    return null;
  }
}

// Main email processing function
function extractEmailBody(rawEmail: string): { html: string; text: string } {
  let html = "";
  let text = "";

  try {
    // Find all boundaries in the email
    const mainBoundaryMatch = rawEmail.match(/boundary="([^"]+)"/);
    if (!mainBoundaryMatch) {
      console.log("No boundary found");
      return { html, text };
    }

    const mainBoundary = mainBoundaryMatch[1];
    console.log("Main boundary:", mainBoundary);

    // Split by main boundary and keep the boundary markers
    const parts = rawEmail.split(new RegExp(`--${mainBoundary}(?:--)?`));

    for (const part of parts) {
      // Look for nested multipart
      if (part.includes("multipart/alternative")) {
        const nestedBoundaryMatch = part.match(/boundary="([^"]+)"/);
        if (nestedBoundaryMatch) {
          const nestedBoundary = nestedBoundaryMatch[1];
          console.log("Found nested boundary:", nestedBoundary);

          // Split by nested boundary and keep the boundary markers
          const nestedParts = part.split(
            new RegExp(`--${nestedBoundary}(?:--)?`)
          );

          for (const nestedPart of nestedParts) {
            if (nestedPart.includes("Content-Type: text/html")) {
              // Extract content after the double newline, handling both \r\n and \n
              const contentMatch = nestedPart.match(
                /(?:\r\n|\n){2}([\s\S]*?)(?:\r\n|\n)*$/
              );
              if (contentMatch) {
                const rawHtml = contentMatch[1].trim();
                // Check if content is quoted-printable
                if (
                  nestedPart.includes(
                    "Content-Transfer-Encoding: quoted-printable"
                  )
                ) {
                  html = decodeQuotedPrintable(rawHtml);
                } else {
                  html = rawHtml;
                }
                console.log("Found HTML content length:", html.length);
              }
            } else if (nestedPart.includes("Content-Type: text/plain")) {
              const contentMatch = nestedPart.match(
                /(?:\r\n|\n){2}([\s\S]*?)(?:\r\n|\n)*$/
              );
              if (contentMatch) {
                const rawText = contentMatch[1].trim();
                if (
                  nestedPart.includes(
                    "Content-Transfer-Encoding: quoted-printable"
                  )
                ) {
                  text = decodeQuotedPrintable(rawText);
                } else {
                  text = rawText;
                }
                console.log("Found text content length:", text.length);
              }
            }
          }
        }
      }
    }

    // Log the extracted content for debugging
    if (html) {
      console.log("HTML content preview:", html.substring(0, 100) + "...");
    }
    if (text) {
      console.log("Text content preview:", text.substring(0, 100) + "...");
    }
  } catch (error) {
    console.error("Error parsing email content:", error);
  }

  return {
    html: html || text,
    text: text || html.replace(/<[^>]*>/g, ""),
  };
}

export async function POST(request: Request) {
  try {
    console.log("📨 Received SendGrid webhook request");

    const formData = await request.formData();
    console.log("Form data keys:", Array.from(formData.keys()));

    // Check if we're receiving raw email or parsed content
    const html = formData.get("html") as string;
    const text = formData.get("text") as string;
    const from = formData.get("from") as string;
    const subject = formData.get("subject") as string;
    const emailRaw = formData.get("email") as string;

    console.log("From:", from);
    console.log("Subject:", subject);
    console.log("Has HTML:", !!html);
    console.log("Has text:", !!text);
    console.log("Has raw email:", !!emailRaw);

    let finalHtml = html;
    let finalText = text;

    // If we have raw email and no parsed content, parse it
    if (emailRaw && !html && !text) {
      const parsed = extractEmailBody(emailRaw);
      finalHtml = parsed.html;
      finalText = parsed.text;
    }

    // Validate required fields
    if (!from || !subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate we have some content
    if (!finalHtml && !finalText) {
      console.error("❌ No email body found");
      return NextResponse.json(
        { error: "No email body found" },
        { status: 400 }
      );
    }

    // Process attachments
    const attachments = [];

    // Look for attachments in the raw email
    if (emailRaw) {
      const mainBoundaryMatch = emailRaw.match(/boundary="([^"]+)"/);
      if (mainBoundaryMatch) {
        const mainBoundary = mainBoundaryMatch[1];
        const parts = emailRaw.split(`--${mainBoundary}`);

        for (const part of parts) {
          if (part.includes("Content-Type: application/pdf")) {
            console.log("Processing PDF attachment");
            const filenameMatch = part.match(/filename="([^"]+)"/);
            const contentMatch = part.match(
              /\r?\n\r?\n([\s\S]*?)(?:\r?\n\r?\n|$)/
            );

            if (filenameMatch && contentMatch) {
              const filename = filenameMatch[1];
              const content = contentMatch[1].trim();

              const attachment = await processAttachment(
                content,
                "application/pdf",
                filename
              );

              if (attachment) {
                try {
                  const uploadUrl = await convex.mutation(
                    api.announcements.generateUploadUrl,
                    { type: "application/pdf" }
                  );

                  const response = await fetch(uploadUrl, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/pdf",
                    },
                    body: attachment.content,
                  });

                  if (!response.ok) {
                    throw new Error(
                      `Failed to upload file: ${response.statusText}`
                    );
                  }

                  const storedUrl = uploadUrl.split("?")[0];
                  attachments.push({
                    url: storedUrl,
                    name: attachment.filename,
                    type: attachment.contentType,
                  });
                  console.log(
                    "Successfully processed PDF attachment:",
                    attachment.filename
                  );
                } catch (error) {
                  console.error(
                    `Failed to process PDF attachment ${attachment.filename}:`,
                    error
                  );
                }
              }
            }
          }
        }
      }
    }

    // Prepare payload for Convex
    const payload = {
      from,
      subject,
      body: finalText,
      htmlBody: finalHtml,
      attachments,
      emailId: `email_${Date.now()}`,
    };

    console.log("📤 Sending to Convex:", payload);

    // Send to Convex
    const result = await convex.mutation(
      api.announcements.processEmailToAnnouncement,
      payload
    );

    console.log("✅ Successfully created announcement:", result);
    return NextResponse.json({ success: true, id: result });
  } catch (error) {
    console.error("❌ Error processing email:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
