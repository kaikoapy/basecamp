// app/api/webhook/sendgrid/route.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Function to decode quoted-printable text
function decodeQuotedPrintable(str: string): string {
  return str
    .replace(/=\r\n/g, "") // Remove soft line breaks
    .replace(/=([0-9A-F]{2})/gi, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
    .replace(/=3D/gi, "=") // Handle equals sign
    .replace(/=20/g, " ") // Handle spaces
    .replace(/=2E/g, ".") // Handle periods
    .replace(/=22/g, '"') // Handle quotes
    .replace(/=27/g, "'"); // Handle apostrophes
}

// Function to extract email body from raw email content
function extractEmailBody(rawEmail: string): { html: string; text: string } {
  let html = "";
  let text = "";

  try {
    console.log("Raw email content:", rawEmail);

    // First try multipart/mixed format
    const boundaryMatch = rawEmail.match(/boundary="([^"]+)"/);
    if (boundaryMatch) {
      console.log("Found boundary:", boundaryMatch[1]);
      const mainBoundary = boundaryMatch[1];
      const parts = rawEmail.split(`--${mainBoundary}`);

      // Try to find the content parts
      for (const part of parts) {
        if (part.includes("text/html")) {
          console.log("Found HTML part");
          const content = part.split("\n\n").slice(1).join("\n\n");
          html = decodeQuotedPrintable(content.trim());
        } else if (part.includes("text/plain")) {
          console.log("Found plain text part");
          const content = part.split("\n\n").slice(1).join("\n\n");
          text = decodeQuotedPrintable(content.trim());
        } else if (part.includes("multipart/alternative")) {
          console.log("Found multipart/alternative");
          // Handle nested multipart/alternative
          const innerBoundaryMatch = part.match(/boundary="([^"]+)"/);
          if (innerBoundaryMatch) {
            const innerBoundary = innerBoundaryMatch[1];
            const innerParts = part.split(`--${innerBoundary}`);

            for (const innerPart of innerParts) {
              if (innerPart.includes("text/html")) {
                console.log("Found HTML in multipart/alternative");
                const content = innerPart.split("\n\n").slice(1).join("\n\n");
                html = decodeQuotedPrintable(content.trim());
              } else if (innerPart.includes("text/plain")) {
                console.log("Found plain text in multipart/alternative");
                const content = innerPart.split("\n\n").slice(1).join("\n\n");
                text = decodeQuotedPrintable(content.trim());
              }
            }
          }
        }
      }
    } else {
      // Fallback to simple content type check
      console.log("No boundary found, trying direct content extraction");
      if (rawEmail.includes("text/html")) {
        const htmlMatch = rawEmail.match(
          /Content-Type: text\/html[^]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n\r?\n|$)/i
        );
        if (htmlMatch) {
          html = decodeQuotedPrintable(htmlMatch[1].trim());
        }
      }
      if (rawEmail.includes("text/plain")) {
        const textMatch = rawEmail.match(
          /Content-Type: text\/plain[^]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n\r?\n|$)/i
        );
        if (textMatch) {
          text = decodeQuotedPrintable(textMatch[1].trim());
        }
      }
    }

    console.log("Extracted HTML:", html ? "Yes" : "No");
    console.log("Extracted Text:", text ? "Yes" : "No");
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

    // Try both formats for attachments
    const attachmentCount = formData.get("attachment-count");
    const hasNumberedAttachments = formData.has("attachment1");

    if (attachmentCount) {
      // Handle parsed format
      const count = parseInt(attachmentCount as string, 10);
      for (let i = 1; i <= count; i++) {
        const attachment = formData.get(`attachment${i}`);
        const filename = formData.get(`attachment-info`) as string;
        if (attachment && filename) {
          try {
            const info = JSON.parse(filename);
            const uploadUrl = await convex.mutation(
              api.announcements.generateUploadUrl,
              {
                type: info.type || "application/octet-stream",
              }
            );

            const response = await fetch(uploadUrl, {
              method: "POST",
              headers: {
                "Content-Type": info.type || "application/octet-stream",
              },
              body: attachment,
            });

            if (!response.ok) {
              throw new Error(`Failed to upload file: ${response.statusText}`);
            }

            const storedUrl = uploadUrl.split("?")[0];
            attachments.push({
              url: storedUrl,
              name: info.filename || `attachment${i}`,
              type: info.type || "application/octet-stream",
            });
          } catch (error) {
            console.error(`Failed to process attachment ${i}:`, error);
          }
        }
      }
    } else if (hasNumberedAttachments) {
      // Handle raw format
      for (let i = 1; ; i++) {
        const attachment = formData.get(`attachment${i}`);
        if (!attachment) break;

        const filename = formData.get(`attachment${i}-filename`) as string;
        const type = formData.get(`attachment${i}-type`) as string;
        const content = formData.get(`attachment${i}-content`) as string;

        if (filename && type && content) {
          try {
            const uploadUrl = await convex.mutation(
              api.announcements.generateUploadUrl,
              {
                type,
              }
            );

            const response = await fetch(uploadUrl, {
              method: "POST",
              headers: {
                "Content-Type": type,
              },
              body: Buffer.from(content, "base64"),
            });

            if (!response.ok) {
              throw new Error(`Failed to upload file: ${response.statusText}`);
            }

            const storedUrl = uploadUrl.split("?")[0];
            attachments.push({
              url: storedUrl,
              name: filename,
              type: type,
            });
          } catch (error) {
            console.error(`Failed to upload attachment ${filename}:`, error);
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

    // Error handling with type checking
    if (error instanceof Error) {
      const message = error.message;
      // Determine if it's a validation error
      const isValidationError = message.includes("ArgumentValidationError");

      return NextResponse.json(
        {
          error: isValidationError ? "Invalid email format" : "Server error",
          details: message,
        },
        { status: isValidationError ? 400 : 500 }
      );
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
