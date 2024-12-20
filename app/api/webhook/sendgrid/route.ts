// app/api/webhook/sendgrid/route.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    // SendGrid sends multipart/form-data
    const formData = await request.formData();

    // Extract email data
    const from = formData.get("from") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const attachments = parseInt(
      (formData.get("attachments") as string) || "0"
    );

    const processedAttachments = [];

    if (attachments > 0) {
      // Get upload URLs for attachments
      const uploadUrls = await convex.mutation(api.files.generateUploadUrls, {
        count: attachments,
      });

      // Process each attachment
      for (let i = 1; i <= attachments; i++) {
        const attachment = formData.get(`attachment${i}`) as File;
        const filename = formData.get(`attachment-info`) as string;
        const info = JSON.parse(filename);

        // Upload to Convex
        await fetch(uploadUrls[i - 1], {
          method: "POST",
          body: attachment,
          headers: {
            "Content-Type": info.type || "application/octet-stream",
          },
        });

        processedAttachments.push({
          url: uploadUrls[i - 1].split("?")[0],
          type: info.type || "application/octet-stream",
          name: info.filename || `attachment${i}`,
        });
      }
    }

    // Create announcement
    await convex.mutation(api.announcements.processEmailToAnnouncement, {
      from,
      subject,
      body: text,
      attachments: processedAttachments,
      emailId: formData.get("email") as string,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing email:", error);
    return NextResponse.json(
      { error: "Failed to process email" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, handle raw body
  },
};
