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

    // Get the raw body
    const rawBody = await request.text();
    console.log("📝 Raw body:", rawBody);

    // Parse the body
    const params = new URLSearchParams(rawBody);

    // Extract and log basic email data
    const emailData = {
      from: params.get("from"),
      subject: params.get("subject"),
      text: params.get("text"),
      html: params.get("html"),
      attachments: params.get("attachment-info"),
    };
    console.log("📧 Parsed email data:", emailData);

    // Ensure we have the required fields
    if (!emailData.from || !emailData.subject) {
      throw new Error("Missing required email fields");
    }

    // Get the email content
    const body = emailData.text || emailData.html || "No content provided";

    const processedAttachments: ProcessedAttachment[] = [];

    // Handle attachments if present
    if (emailData.attachments) {
      try {
        const attachmentsInfo = JSON.parse(emailData.attachments) as Record<
          string,
          AttachmentInfo
        >;
        console.log(`📎 Processing attachments:`, attachmentsInfo);

        // Get upload URLs for attachments
        const uploadUrls = await convex.mutation(api.files.generateUploadUrls, {
          count: Object.keys(attachmentsInfo).length,
        });
        console.log("🔗 Generated upload URLs:", uploadUrls);

        // Process each attachment
        for (const [key, info] of Object.entries(attachmentsInfo)) {
          const attachmentContent = params.get(key);
          if (attachmentContent) {
            const index = parseInt(key.replace("attachment", "")) - 1;
            console.log(`📦 Processing attachment ${key}`);

            // Upload to Convex
            await fetch(uploadUrls[index], {
              method: "POST",
              body: attachmentContent,
              headers: {
                "Content-Type": info.type || "application/octet-stream",
              },
            });

            processedAttachments.push({
              url: uploadUrls[index].split("?")[0],
              type: info.type || "application/octet-stream",
              name: info.filename || `attachment${index + 1}`,
            });
          }
        }
      } catch (attachmentError) {
        console.error("📎 Error processing attachments:", attachmentError);
      }
    }

    // Create announcement
    const result = await convex.mutation(
      api.announcements.processEmailToAnnouncement,
      {
        from: emailData.from,
        subject: emailData.subject,
        body,
        attachments: processedAttachments,
        emailId: new Date().toISOString(),
      }
    );
    console.log("✅ Successfully created announcement:", result);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("❌ Error processing email:", error);
    // Log the full error for debugging
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
