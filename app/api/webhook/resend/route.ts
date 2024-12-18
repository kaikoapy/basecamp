// app/api/webhook/resend/route.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface Attachment {
  content: string; // base64 encoded
  filename: string;
  contentType: string; // MIME type e.g. 'application/pdf', 'image/jpeg'
  size?: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, subject, text, attachments } = body;

    // Clean up the text content
    const cleanDescription = text.split("\n-- ")[0].split("On")[0].trim();

    let processedAttachments: { url: string; type: string; name: string }[] =
      [];

    if (attachments && attachments.length > 0) {
      // Get upload URLs for all attachments
      const uploadUrls = await convex.mutation(api.files.generateUploadUrls, {
        count: attachments.length,
      });

      // Process each attachment
      processedAttachments = await Promise.all(
        attachments.map(async (att: Attachment, index: number) => {
          // Convert base64 to blob
          const blob = Buffer.from(att.content, "base64");

          // Upload to Convex storage
          await fetch(uploadUrls[index], {
            method: "POST",
            body: blob,
            headers: {
              "Content-Type": att.contentType,
            },
          });

          // Return processed attachment info
          return {
            url: uploadUrls[index].split("?")[0],
            type: att.contentType,
            name: att.filename,
          };
        })
      );
    }

    // Create announcement with both files and metadata
    await convex.mutation(api.announcements.processEmailToAnnouncement, {
      from,
      subject,
      body: cleanDescription,
      attachments: processedAttachments,
      emailId: body.id,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing email:", error);
    return Response.json({ error: "Failed to process email" }, { status: 500 });
  }
}
