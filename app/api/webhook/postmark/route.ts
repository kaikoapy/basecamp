import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { ALLOWED_EMAILS } from "@/app/data/allowed-emails";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Add the hardcoded org ID
const HARDCODED_ORG_ID = "org_2qOItQ3RqlWD4snDfmLRD1CG5J5";

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
    console.log("📨 Received Postmark webhook request");

    // Log the request method and headers for debugging
    console.log("Request method:", request.method);
    console.log("Request headers:", Object.fromEntries(request.headers));

    // Postmark sends JSON directly - no need for formData parsing
    const data = (await request.json()) as PostmarkWebhook;

    // Add email validation
    if (!ALLOWED_EMAILS.includes(data.From.toLowerCase())) {
      console.warn(`Unauthorized email attempt from: ${data.From}`);
      return NextResponse.json(
        { error: "Unauthorized sender" },
        { status: 403 }
      );
    }

    console.log("Webhook data received:", {
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
            //   console.warn(`Attachment too large: ${content.length} bytes`);
            //   continue;
            // }

            const uploadUrl = await convex.mutation(
              api.announcements.generateUploadUrl,
              { type: attachment.ContentType }
            );

            console.log("Generated Convex upload URL:", uploadUrl);

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
            console.log("Received storage ID:", storageId);

            // Generate the download URL using the storage ID
            const storedUrl = await convex.query(api.announcements.getUrl, {
              storageId,
            });
            console.log("Constructed download URL:", storedUrl);

            if (storedUrl) {
              attachments.push({
                url: storedUrl,
                name: attachment.Name,
                type: attachment.ContentType,
              });
            } else {
              console.error(
                "Failed to generate download URL for storage ID:",
                storageId
              );
            }

            console.log(
              "Successfully processed attachment:",
              attachment.Name
            );
          } catch (error) {
            console.error(
              `Failed to process attachment ${attachment.Name}:`,
              error
            );
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
      attachments: attachments || [], // Ensure attachments is always an array
      emailId: data.MessageID,
      orgId: HARDCODED_ORG_ID, // Make sure this line is here
    };

    console.log("📤 Sending to Convex with payload:", payload); // Add this log to verify

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
