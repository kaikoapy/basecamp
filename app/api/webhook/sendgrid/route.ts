// app/api/webhook/sendgrid/route.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Handle GET requests (SendGrid verification)
export async function GET() {
  console.log("📝 Received GET request - SendGrid verification");
  return NextResponse.json({ success: true });
}

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
    // Strip HTML tags
    return htmlMatch[1].replace(/<[^>]*>/g, "").trim();
  }

  return "No content available";
}

// Handle POST requests (actual emails)
export async function POST(request: Request) {
  try {
    console.log("📨 Received SendGrid webhook request");

    // SendGrid sends multipart/form-data
    const formData = await request.formData();

    // Log received data for debugging
    const emailRaw = formData.get("email") as string;
    console.log("📝 Form data received:", {
      from: formData.get("from"),
      subject: formData.get("subject"),
      attachmentsCount: formData.get("attachments"),
      emailId: emailRaw,
    });

    // Extract email data
    const from = formData.get("from") as string;
    const subject = formData.get("subject") as string;

    // Extract body from raw email content
    const body = extractEmailBody(emailRaw);

    // Validate required fields
    if (!from || !subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create announcement
    const result = await convex.mutation(
      api.announcements.processEmailToAnnouncement,
      {
        from,
        subject,
        body: body || "No content provided",
        attachments: [],
        emailId: `email_${Date.now()}`, // Generate unique ID
      }
    );

    console.log("✅ Successfully created announcement:", result);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error processing email:", error);

    // Improved error response
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to process email",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
