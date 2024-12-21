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

    // Extract body from raw email content
    const body = extractEmailBody(emailRaw);

    console.log("📧 Processed email data:", {
      from,
      subject,
      bodyLength: body.length,
    });

    if (!body) {
      console.error("❌ No email body extracted");
      return NextResponse.json(
        { error: "No email body found" },
        { status: 400 }
      );
    }

    // Prepare payload for Convex
    const payload = {
      from,
      subject,
      body,
      attachments: [], // No attachments for now
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

    // Improved error handling
    let statusCode = 500;
    let message = "Failed to process email";

    if (error instanceof Error) {
      if (error.message.includes("ArgumentValidationError")) {
        statusCode = 400;
        message = "Invalid email data format";
      }
      console.error("Error details:", error.message);
    }

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
