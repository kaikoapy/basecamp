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

// Handle POST requests (actual emails)
export async function POST(request: Request) {
  try {
    console.log("📨 Received SendGrid webhook request");

    // SendGrid sends multipart/form-data
    const formData = await request.formData();

    // Log received data for debugging
    console.log("📝 Form data received:", {
      from: formData.get("from"),
      subject: formData.get("subject"),
      attachmentsCount: formData.get("attachments"),
      emailId: formData.get("email"),
    });

    // Extract and validate email data
    const from = formData.get("from") as string;
    const subject = formData.get("subject") as string;
    let text = formData.get("text") as string;
    const html = formData.get("html") as string;

    // Validate required fields
    if (!from || !subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If text is not available, try to extract from HTML
    if (!text && html) {
      // Simple HTML to text conversion
      text = html.replace(/<[^>]*>/g, "").trim();
    }

    // Ensure we have a body
    if (!text) {
      text = "No content provided";
    }

    // Create announcement
    const result = await convex.mutation(
      api.announcements.processEmailToAnnouncement,
      {
        from,
        subject,
        body: text,
        attachments: [], // Handle attachments if needed
        emailId: (formData.get("email") as string) || `email_${Date.now()}`, // Fallback ID if none provided
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
