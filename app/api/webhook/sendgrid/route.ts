// app/api/webhook/sendgrid/route.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface AttachmentInfo {
  type: string;
  filename: string;
}

interface ProcessedAttachment {
  url: string;
  type: string;
  name: string;
}

export async function POST(request: Request) {
  // Log immediately when request is received
  console.log("🚨 Webhook endpoint hit");

  try {
    // Log the raw request
    const clone = request.clone();
    const rawBody = await clone.text();
    console.log("📬 Raw request body:", rawBody);

    console.log("📨 Trying to parse form data");
    const formData = await request.formData();
    console.log("📦 Form data parsed successfully");

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

    const processedAttachments: ProcessedAttachment[] = [];

    // Handle attachments if they exist
    const attachmentCount = formData.get("attachments");
    if (attachmentCount) {
      const count = parseInt(attachmentCount as string);
      console.log(`📎 Processing ${count} attachments`);

      const uploadUrls = await convex.mutation(api.files.generateUploadUrls, {
        count,
      });

      for (let i = 1; i <= count; i++) {
        const attachment = formData.get(`attachment${i}`);
        const attachmentInfo = formData.get(`attachment-info${i}`);

        if (attachment && attachmentInfo) {
          const info = JSON.parse(attachmentInfo as string) as AttachmentInfo;
          console.log(`📦 Processing attachment ${i}:`, info);

          await fetch(uploadUrls[i - 1], {
            method: "POST",
            body: attachment,
            headers: {
              "Content-Type": info.type || "application/octet-stream",
            },
          });

          processedAttachments.push({
            url: uploadUrls[i - 1].split("?")[0],
            type: info.type,
            name: info.filename,
          });
        }
      }
    }

    // Create announcement
    const result = await convex.mutation(
      api.announcements.processEmailToAnnouncement,
      {
        from,
        subject,
        body: emailContent,
        attachments: processedAttachments,
        emailId: email || new Date().toISOString(),
      }
    );

    console.log("✅ Successfully created announcement:", result);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("💥 Webhook Error:", error);
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

// Also add a GET method to test if the endpoint is accessible
export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint is working" });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
