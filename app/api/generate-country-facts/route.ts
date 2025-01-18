import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PDFDocument, rgb, StandardFonts, PDFFont } from "pdf-lib";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to wrap text and return array of lines
function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

async function fetchImageAsBytes(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

async function createPage(
  pdfDoc: PDFDocument,
  country: string,
  facts: string,
  flagUrl: string | undefined,
  isSpanish: boolean
) {
  // Copy the blank page template
  const blankPdfPath = path.join(
    process.cwd(),
    "public",
    "BlankCountryFacts.pdf"
  );
  const blankPdfBytes = fs.readFileSync(blankPdfPath);
  const blankPdfDoc = await PDFDocument.load(blankPdfBytes);
  const [templatePage] = await pdfDoc.copyPages(blankPdfDoc, [0]);
  pdfDoc.addPage(templatePage);

  const page = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  // Embed the font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Constants for layout
  const margin = 50;
  const titleSize = 24;
  const factSize = 12;
  const lineHeight = factSize * 1.5;
  const maxWidth = pageWidth - margin * 2;
  const flagHeight = 120;
  const flagMarginRight = 20;

  let currentY = pageHeight - margin;

  // Add flag if available
  if (flagUrl) {
    try {
      const flagImageBytes = await fetchImageAsBytes(flagUrl);
      const flagImage = await pdfDoc.embedPng(flagImageBytes);
      const flagDims = flagImage.scale(flagHeight / flagImage.height);

      // Calculate vertical center of flag
      const flagTop = currentY - flagDims.height + titleSize / 2;
      const flagCenter = flagTop + flagDims.height / 2;
      const titleOffset = titleSize / 2;

      page.drawImage(flagImage, {
        x: margin,
        y: flagTop,
        width: flagDims.width,
        height: flagDims.height,
      });

      // Add title with country name vertically centered with flag
      const displayCountry = isSpanish ? `${country} (Español)` : country;
      page.drawText(displayCountry, {
        x: margin + flagDims.width + flagMarginRight,
        y: flagCenter - titleOffset,
        size: titleSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      currentY -= Math.max(flagDims.height, titleSize) + lineHeight;
    } catch (error) {
      console.error("Error embedding flag:", error);
      const displayCountry = isSpanish ? `${country} (Español)` : country;
      page.drawText(displayCountry, {
        x: margin,
        y: currentY,
        size: titleSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      currentY -= titleSize + lineHeight;
    }
  } else {
    const displayCountry = isSpanish ? `${country} (Español)` : country;
    page.drawText(displayCountry, {
      x: margin,
      y: currentY,
      size: titleSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    currentY -= titleSize + lineHeight;
  }

  // Add facts with proper wrapping and spacing
  const factsArray = facts.split("\n").filter(Boolean);
  factsArray.forEach((fact) => {
    const wrappedLines = wrapText(fact, maxWidth, font, factSize);

    wrappedLines.forEach((line) => {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: factSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight;
    });

    currentY -= lineHeight / 2;
  });
}

export async function POST() {
  try {
    // First, get a random country from OpenAI
    const countryCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that knows about world geography. Choose an interesting country that people might not know much about. Respond with ONLY the country name, nothing else.",
        },
        {
          role: "user",
          content:
            "Choose a random country. Be diverse in your selection, including countries from all continents and of various sizes. Don't always pick the most well-known countries.",
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const country =
      countryCompletion.choices[0].message.content?.trim() || "Unknown Country";

    // Generate facts about the chosen country
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides interesting and educational facts about countries. Each fact must be 25 words or less. Focus on unique, surprising facts that would captivate people.",
        },
        {
          role: "user",
          content: `Generate 10 fascinating facts about ${country}. Each fact MUST be 25 words or less. Format as a numbered list. Mix cultural, historical, geographical, and modern facts. Be concise and engaging.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const facts = completion.choices[0].message.content || "No facts available";

    // Get Spanish translation of the facts
    const translationCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful translator. Translate the following facts to Spanish, maintaining the same numbered list format. Keep the translation natural and accurate.",
        },
        {
          role: "user",
          content: facts,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const spanishFacts =
      translationCompletion.choices[0].message.content ||
      "No hay datos disponibles";

    // Get country information and flag
    const countryResponse = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );
    const countryData = await countryResponse.json();
    const flagUrl = countryData[0]?.flags?.png || countryData[0]?.flags?.svg;

    // Create PDF document
    const pdfDoc = await PDFDocument.create();

    // Create English page
    await createPage(pdfDoc, country, facts, flagUrl, false);

    // Create Spanish page
    await createPage(pdfDoc, country, spanishFacts, flagUrl, true);

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${country}Facts.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate facts" },
      { status: 500 }
    );
  }
}
