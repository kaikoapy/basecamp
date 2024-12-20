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
    console.log("📝 Form data received:", {
      from: formData.get("from"),
      subject: formData.get("subject"),
      attachmentsCount: formData.get("attachments"),
      emailId: formData.get("email"),
    });

    // Extract email data
    const from = formData.get("from") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;

    // Create announcement
    const result = await convex.mutation(
      api.announcements.processEmailToAnnouncement,
      {
        from,
        subject,
        body: text,
        attachments: [],
        emailId: formData.get("email") as string,
      }
    );
    console.log("✅ Successfully created announcement:", result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error processing email:", error);
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
