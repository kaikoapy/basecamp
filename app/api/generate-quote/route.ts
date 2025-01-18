import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Clean text for PDF compatibility
function cleanText(text: string): string {
  return text
    .replace(/[\n\r]+/g, " ") // Replace newlines with spaces
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing whitespace
}

async function createQuotePage(
  pdfDoc: PDFDocument,
  quote: string,
  author: string
) {
  // Copy the blank page template
  const blankPdfPath = path.join(process.cwd(), "public", "BlankQuote.pdf");
  const blankPdfBytes = fs.readFileSync(blankPdfPath);
  const blankPdfDoc = await PDFDocument.load(blankPdfBytes);
  const [templatePage] = await pdfDoc.copyPages(blankPdfDoc, [0]);
  pdfDoc.addPage(templatePage);

  const page = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const authorFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Constants for layout
  const margin = 100;
  const quoteSize = 36;
  const authorSize = 24;
  const maxWidth = pageWidth - margin * 2;

  // Clean and word wrap the quote
  const cleanedQuote = cleanText(quote);
  const lines = [];
  let currentLine = "";
  const words = cleanedQuote.split(" ");

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, quoteSize);

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  // Draw quote lines
  const lineHeight = quoteSize * 1.5;
  const totalHeight = lines.length * lineHeight;
  let currentY = pageHeight / 2 + totalHeight / 2;

  lines.forEach((line) => {
    const lineWidth = font.widthOfTextAtSize(line, quoteSize);
    page.drawText(line, {
      x: (pageWidth - lineWidth) / 2,
      y: currentY - lineHeight,
      size: quoteSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  });

  // Draw author (right-aligned below the quote)
  const cleanedAuthor = cleanText(author);
  const authorText = `- ${cleanedAuthor}`;
  const authorWidth = authorFont.widthOfTextAtSize(authorText, authorSize);
  page.drawText(authorText, {
    x: (pageWidth + maxWidth) / 2 - authorWidth,
    y: currentY - lineHeight,
    size: authorSize,
    font: authorFont,
    color: rgb(0, 0, 0),
  });
}

export async function POST() {
  try {
    // Generate an inspirational quote
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a wise philosopher who creates profound, meaningful quotes in the style of great thinkers like the Dalai Lama, Confucius, and Rumi. Create quotes that are deep yet accessible, focusing on wisdom, peace, and understanding. Respond with ONLY the quote and author in this format: QUOTE - AUTHOR",
        },
        {
          role: "user",
          content:
            "Generate a short, inspiring quote (max 50 words) and attribute it to a philosophical figure or wise teacher. Make it sound profound and meaningful, but keep it simple enough for everyone to understand.",
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const response =
      completion.choices[0].message.content || "Peace begins within. - Unknown";

    // Split into quote and author and clean the text
    const [quote, author] = response.split(" - ").map((s) => cleanText(s));

    // Get Spanish translation
    const translationCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a skilled translator specializing in translating philosophical quotes to Spanish. Maintain the poetic nature and impact of the original quote. Always respond with the translated quote followed by a hyphen and the translated author name. Do not include any quotation marks.",
        },
        {
          role: "user",
          content: `Translate this philosophical quote to Spanish, preserving its meaning and impact. Keep the same format with the hyphen: ${quote} - ${author}`,
        },
      ],
      model: "gpt-4o-mini",
    });

    const spanishResponse =
      translationCompletion.choices[0].message.content ||
      "La paz comienza dentro. - Desconocido";
    const [spanishQuote, spanishAuthor] = spanishResponse
      .split(" - ")
      .map((s) => cleanText(s));

    // Create PDF document
    const pdfDoc = await PDFDocument.create();

    // Create English page
    await createQuotePage(pdfDoc, quote, author);

    // Create Spanish page
    await createQuotePage(pdfDoc, spanishQuote, spanishAuthor);

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="InspiringQuote.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate quote" },
      { status: 500 }
    );
  }
}
