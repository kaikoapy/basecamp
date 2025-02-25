import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { ALLOWED_EMAILS } from "@/app/data/allowed-emails";
import { createLogger } from "@/lib/logger";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const logger = createLogger("postmark-webhook");

// Add the hardcoded org ID

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

// Configure allowed methods
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    logger.info("Received Postmark webhook request");
    
    logger.debug("Request details", {
      method: request.method,
      headers: Object.fromEntries(request.headers)
    });

    // Postmark sends JSON directly - no need for formData parsing
    const data = (await request.json()) as PostmarkWebhook;

    // Add email validation
    if (!ALLOWED_EMAILS.includes(data.From.toLowerCase())) {
      logger.warn(`Unauthorized email attempt from: ${data.From}`);
      return NextResponse.json(
        { error: "Unauthorized sender" },
        { status: 403 }
      );
    }

    logger.info("Webhook data received", {
      from: data.From,
      subject: data.Subject,
      messageId: data.MessageID,
      hasHtml: !!data.HtmlBody,
      hasText: !!data.TextBody,
      attachmentsCount: data.Attachments?.length || 0,
    });

    // Process attachments if any
    const attachments = [];

    if (data.Attachments?.length) {
      for (const attachment of data.Attachments) {
        // Allow both PDFs and images
        if (attachment.ContentType === "application/pdf" || 
            attachment.ContentType.startsWith("image/")) {
          try {
            const content = Buffer.from(attachment.Content, "base64");

            // Remove size limit check to allow all attachments
            // const MAX_SIZE = 5 * 1024 * 1024; // Commented out
            // if (content.length > MAX_SIZE) {
            //   logger.warn(`Attachment too large: ${content.length} bytes`);
            //   continue;
            // }

            const uploadUrl = await convex.mutation(
              api.announcements.generateUploadUrl,
              { type: attachment.ContentType }
            );

            logger.debug("Generated Convex upload URL", { uploadUrl });

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

            // Get the storage ID from the response
            const { storageId } = await response.json();
            logger.debug("Received storage ID", { storageId });

            // Generate the download URL using the storage ID
            const storedUrl = await convex.query(api.announcements.getUrl, {
              storageId,
            });
            logger.debug("Storage details", { 
              storageId,
              storedUrl 
            });

            if (storedUrl) {
              attachments.push({
                url: storedUrl,
                name: attachment.Name,
                type: attachment.ContentType,
              });
            } else {
              logger.error("Failed to generate download URL", { storageId });
            }

            logger.info("Successfully processed attachment", { 
              name: attachment.Name 
            });
          } catch (error) {
            logger.error("Failed to process attachment", { 
              name: attachment.Name,
              error: error instanceof Error ? error.message : String(error)
            });
          }
        }
      }
    }

    // Prepare payload for Convex - make sure orgId is included
    const payload = {
      from: data.FromName || data.From,
      subject: data.Subject,
      body: data.TextBody,
      htmlBody: data.HtmlBody,
      attachments: attachments || [],
      emailId: data.MessageID,
    };

    logger.debug("Sending to Convex", { payload });

    // Send to Convex
    const result = await convex.mutation(
      api.announcements.processEmailToAnnouncement,
      payload
    );

    logger.info("Successfully created announcement", { result });
    return NextResponse.json({ success: true, id: result });
  } catch (error) {
    logger.error("Error processing webhook", { error });
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
