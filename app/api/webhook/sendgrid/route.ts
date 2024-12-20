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
  try {
    console.log("📨 Received SendGrid webhook request");

    // Parse form data
    const formData = await request.formData();

    // Extract email content
    const from = formData.get("from") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const html = formData.get("html") as string;
    const email = formData.get("email") as string;

    console.log("📧 Parsed email content:", {
      from,
      subject,
      text,
      html,
    });

    // Ensure we have required fields
    if (!from || !subject) {
      throw new Error("Missing required email fields");
    }

    // Get the email content (prefer text over HTML)
    const body = text || html?.replace(/<[^>]*>/g, "") || "No content provided";

    console.log("📝 Processed body:", body);

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
        body,
        attachments: processedAttachments,
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
