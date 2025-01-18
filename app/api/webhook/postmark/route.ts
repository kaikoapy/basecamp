import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface PostmarkAttachment {
  Name: string;
  Content: string;
  ContentType: string;
  ContentLength: number;
}

interface PostmarkWebhook {
  FromName: string;
  From: string;
  Subject: string;
  TextBody: string;
  HtmlBody: string;
  Attachments: PostmarkAttachment[];
  MessageID: string;
}

export async function POST(request: Request) {
  try {
    console.log("📨 Received Postmark webhook request");

    // Postmark sends JSON directly - no need for formData parsing
    const data = (await request.json()) as PostmarkWebhook;

    console.log("From:", data.From);
    console.log("Subject:", data.Subject);
    console.log("Has HTML:", !!data.HtmlBody);
    console.log("Has text:", !!data.TextBody);

    // Process attachments if any
    const attachments = [];

    if (data.Attachments?.length) {
      for (const attachment of data.Attachments) {
        // Only process PDFs for now
        if (attachment.ContentType === "application/pdf") {
          try {
            const content = Buffer.from(attachment.Content, "base64");

            // Check size (5MB limit)
            const MAX_SIZE = 5 * 1024 * 1024;
            if (content.length > MAX_SIZE) {
              console.warn(`Attachment too large: ${content.length} bytes`);
              continue;
            }

            const uploadUrl = await convex.mutation(
              api.announcements.generateUploadUrl,
              { type: attachment.ContentType }
            );

            const response = await fetch(uploadUrl, {
              method: "POST",
              headers: {
                "Content-Type": attachment.ContentType,
              },
              body: content,
            });

            if (!response.ok) {
              throw new Error(`Failed to upload file: ${response.statusText}`);
            }

            const storedUrl = uploadUrl.split("?")[0];
            attachments.push({
              url: storedUrl,
              name: attachment.Name,
              type: attachment.ContentType,
            });

            console.log(
              "Successfully processed PDF attachment:",
              attachment.Name
            );
          } catch (error) {
            console.error(
              `Failed to process PDF attachment ${attachment.Name}:`,
              error
            );
          }
        }
      }
    }

    // Prepare payload for Convex
    const payload = {
      from: data.From,
      subject: data.Subject,
      body: data.TextBody,
      htmlBody: data.HtmlBody,
      attachments,
      emailId: data.MessageID,
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
    console.error("Error processing email:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
