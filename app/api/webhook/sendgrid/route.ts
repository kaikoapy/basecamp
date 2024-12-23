// app/api/webhook/sendgrid/route.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Function to extract email body from raw email content
function extractEmailBody(rawEmail: string): string {
  // Look for text/plain content
  const textMatch = rawEmail.match(
    /Content-Type: text\/plain;.*?\r\n\r\n([\s\S]*?)\r\n--/i
  );
  if (textMatch && textMatch[1]) {
    return textMatch[1].trim();
  }

  // Fallback to HTML content
  const htmlMatch = rawEmail.match(
    /Content-Type: text\/html;.*?\r\n\r\n([\s\S]*?)\r\n--/i
  );
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1].replace(/<[^>]*>/g, "").trim();
  }

  return "No content available";
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
    const body = extractEmailBody(emailRaw);
    if (!body) {
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

      const filename = formData.get(`attachment${i}-filename`);
      const type = formData.get(`attachment${i}-type`);

      // Here you would upload the attachment to your file storage
      // and get back a URL. For example:
      // const url = await uploadToStorage(attachment);

      attachments.push({
        url: "url_from_storage",
        name: filename as string,
        type: type as string,
      });
    }

    // Prepare payload for Convex
    const payload = {
      from,
      subject,
      body,
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
