// app/api/webhook/sendgrid/route.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Function to decode quoted-printable text with better UTF-8 handling
function decodeQuotedPrintable(str: string): string {
  // Common UTF-8 sequences in emails
  const utf8Replacements: Record<string, string> = {
    "=C2=A0": "\u00A0", // Non-breaking space
    "=E2=80=98": "\u2018", // Left single quote
    "=E2=80=99": "\u2019", // Right single quote
    "=E2=80=9C": "\u201C", // Left double quote
    "=E2=80=9D": "\u201D", // Right double quote
    "=E2=80=93": "\u2013", // En dash
    "=E2=80=94": "\u2014", // Em dash
    "=E2=80=A6": "\u2026", // Ellipsis
    "=C3=A9": "\u00E9", // é
    "=C3=A8": "\u00E8", // è
  };

  // First replace known UTF-8 sequences
  let decoded = str;
  for (const [encoded, char] of Object.entries(utf8Replacements)) {
    decoded = decoded.replace(new RegExp(encoded, "g"), char);
  }

  // Remove soft line breaks
  decoded = decoded.replace(/=(?:\r\n?|\n)/g, "");

  // Handle remaining quoted-printable encodings
  decoded = decoded.replace(/=([0-9A-F]{2})/gi, (_, p1) => {
    try {
      return String.fromCharCode(parseInt(p1, 16));
    } catch (error) {
      console.error("Error decoding hex:", p1, error);
      return "";
    }
  });

  return decoded;
}

// Main email processing function
function extractEmailBody(rawEmail: string): { html: string; text: string } {
  let html = "";
  let text = "";

  try {
    // First try to find HTML content directly
    const htmlMatch = rawEmail.match(
      /Content-Type: text\/html[^]*?\r?\n\r?\n([^]*?)(?:\r?\n--[^\r\n]*|$)/i
    );
    if (htmlMatch) {
      const rawHtml = htmlMatch[1].trim();
      // Check if content is quoted-printable
      if (rawEmail.match(/Content-Transfer-Encoding: quoted-printable/i)) {
        html = decodeQuotedPrintable(rawHtml);
      } else {
        html = rawHtml;
      }
      console.log("Found HTML content directly");
    }

    // If no HTML found, try multipart parsing
    if (!html) {
      const mainBoundaryMatch = rawEmail.match(/boundary="([^"]+)"/);
      if (mainBoundaryMatch) {
        const mainBoundary = mainBoundaryMatch[1];
        console.log("Main boundary:", mainBoundary);

        // Split by main boundary
        const parts = rawEmail.split(new RegExp(`--${mainBoundary}(?:--)?`));

        for (const part of parts) {
          if (part.includes("Content-Type: text/html")) {
            const contentMatch = part.match(
              /(?:\r\n|\n){2}([^]*?)(?:\r\n|\n)*$/
            );
            if (contentMatch) {
              const rawHtml = contentMatch[1].trim();
              if (
                part.includes("Content-Transfer-Encoding: quoted-printable")
              ) {
                html = decodeQuotedPrintable(rawHtml);
              } else {
                html = rawHtml;
              }
              console.log("Found HTML in multipart");
            }
          } else if (part.includes("Content-Type: text/plain")) {
            const contentMatch = part.match(
              /(?:\r\n|\n){2}([^]*?)(?:\r\n|\n)*$/
            );
            if (contentMatch) {
              const rawText = contentMatch[1].trim();
              if (
                part.includes("Content-Transfer-Encoding: quoted-printable")
              ) {
                text = decodeQuotedPrintable(rawText);
              } else {
                text = rawText;
              }
              console.log("Found plain text in multipart");
            }
          }
        }
      }
    }

    // Clean up HTML content
    if (html) {
      // Ensure we preserve all HTML attributes and styling
      html = html
        .replace(/=3D/g, "=") // Fix equals signs first
        .replace(/=([0-9A-F]{2})/gi, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        );

      // Convert plain text to HTML if no HTML tags found
      if (!html.includes("<")) {
        html = html
          .split(/\r?\n\r?\n/)
          .map((paragraph) => `<p>${paragraph.replace(/\r?\n/g, "<br>")}</p>`)
          .join("");
      }

      // Wrap in email-content div with styles if not already wrapped
      if (!html.includes('class="email-content"')) {
        html = `<div class="email-content" style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6;">${html}</div>`;
      }

      console.log("Cleaned HTML preview:", html.substring(0, 100) + "...");
    }

    // Log the extracted content for debugging
    if (html) console.log("Final HTML length:", html.length);
    if (text) console.log("Final text length:", text.length);
  } catch (error) {
    console.error("Error parsing email content:", error);
  }

  return {
    html: html || text,
    text: text || (html ? html.replace(/<[^>]*>/g, "") : ""),
  };
}

// Attachment processing
interface Attachment {
  filename: string;
  content: Buffer;
  contentType: string;
  size: number;
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
      filename: filename.replace(/[^a-zA-Z0-9.-]/g, "_").substring(0, 255),
      content: buffer,
      contentType,
      size: buffer.length,
    };
  } catch (error) {
    console.error("Failed to process attachment:", error);
    return null;
  }
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
      console.log("Parsing raw email content...");
      const parsed = extractEmailBody(emailRaw);
      finalHtml = parsed.html;
      finalText = parsed.text;
      console.log("Parsed HTML:", finalHtml);
      console.log("Parsed Text:", finalText);
    }

    // Validate required fields
    if (!from || !subject) {
      console.error("❌ Missing required fields: from or subject");
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
    console.log("Looking for attachments in the raw email...");

    // Look for attachments in the raw email
    if (emailRaw) {
      const mainBoundaryMatch = emailRaw.match(/boundary="([^"]+)"/);
      if (mainBoundaryMatch) {
        const mainBoundary = mainBoundaryMatch[1];
        console.log("Main boundary found:", mainBoundary);
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
                  console.log("Uploading attachment:", attachment.filename);
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
      } else {
        console.warn("No main boundary found in the raw email.");
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

    console.log("📤 Sending to Convex:", JSON.stringify(payload, null, 2));

    // Send to Convex
    const result = await convex.mutation(
      api.announcements.processEmailToAnnouncement,
      payload
    );

    console.log("✅ Successfully created announcement:", result);
    return NextResponse.json({ success: true, id: result });
  } catch (error) {
    console.error("Error processing email:", error);
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
