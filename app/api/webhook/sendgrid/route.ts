// app/api/webhook/sendgrid/route.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    console.log("📨 Received SendGrid webhook request");

    const formData = await request.formData();

    // Debug: Log all available form data keys and values
    console.log("🔍 All form data:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Try different possible keys where the content might be
    const from = formData.get("from") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const html = formData.get("html") as string;
    const body = formData.get("body") as string;
    const content = formData.get("content") as string;
    const plain = formData.get("plain") as string;
    const email = formData.get("email") as string;

    console.log("📧 All possible content fields:", {
      text,
      html,
      body,
      content,
      plain,
    });

    // Get the email content (try all possible fields)
    const emailContent =
      text ||
      html?.replace(/<[^>]*>/g, "") ||
      body ||
      content ||
      plain ||
      "No content provided";

    // Create announcement
    const result = await convex.mutation(
      api.announcements.processEmailToAnnouncement,
      {
        from,
        subject,
        body: emailContent,
        attachments: [], // Handle attachments later
        emailId: email || new Date().toISOString(),
      }
    );

    console.log("✅ Successfully created announcement:", result);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("❌ Error processing email:", error);
    if (error instanceof Error) {
      console.error("Detailed error:", {
        message: error.message,
        stack: error.stack,
      });
      return NextResponse.json(
        { error: "Failed to process email", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process email" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
