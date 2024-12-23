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
    // Find the main boundary
    const boundaryMatch = rawEmail.match(/boundary="([^"]+)"/);
    if (!boundaryMatch) return { html, text };

    const mainBoundary = boundaryMatch[1];
    const parts = rawEmail.split(`--${mainBoundary}`);

    // Find the alternative part (contains both HTML and text)
    const alternativePart = parts.find((part) =>
      part.includes("multipart/alternative")
    );
    if (!alternativePart) return { html, text };

    // Find the inner boundary
    const innerBoundaryMatch = alternativePart.match(/boundary="([^"]+)"/);
    if (!innerBoundaryMatch) return { html, text };

    const innerBoundary = innerBoundaryMatch[1];
    const contentParts = alternativePart.split(`--${innerBoundary}`);

    // Extract HTML content
    const htmlPart = contentParts.find((part) => part.includes("text/html"));
    if (htmlPart) {
      const htmlContent = htmlPart.split("\n\n").slice(1).join("\n\n");
      html = decodeQuotedPrintable(htmlContent.trim());
    }

    // Extract plain text content
    const textPart = contentParts.find((part) => part.includes("text/plain"));
    if (textPart) {
      const textContent = textPart.split("\n\n").slice(1).join("\n\n");
      text = decodeQuotedPrintable(textContent.trim());
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
    const emailRaw = formData.get("email") as string;
    const from = formData.get("from") as string;
    const subject = formData.get("subject") as string;

    // Validate required fields
    if (!from || !subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract and validate body
    const { html, text } = extractEmailBody(emailRaw);
    if (!html && !text) {
      console.error("❌ No email body extracted");
      return NextResponse.json(
        { error: "No email body found" },
        { status: 400 }
      );
    }

    // Process attachments
    const attachments = [];
    for (let i = 1; ; i++) {
      const attachment = formData.get(`attachment${i}`);
      if (!attachment) break;

      const filename = formData.get(`attachment${i}-filename`) as string;
      const type = formData.get(`attachment${i}-type`) as string;
      const content = formData.get(`attachment${i}-content`) as string;

      if (filename && type && content) {
        try {
          // Get upload URL from Convex
          const uploadUrl = await convex.mutation(
            api.announcements.generateUploadUrl,
            {
              type,
            }
          );

          // Upload file to Convex storage
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

          // Get the stored URL
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

    // Prepare payload for Convex
    const payload = {
      from,
      subject,
      body: text,
      htmlBody: html,
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
