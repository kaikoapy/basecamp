import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

// Input validation schema
const InputSchema = z.array(
  z.object({
    name: z.string(),
    position: z.string().optional(),
    department: z.string().optional(),
    extension: z.string().optional(),
    number: z.string().optional(),
    email: z.string().optional(),
  })
);

// Wrapper schema to handle both array and object structures
const InputWrapperSchema = z.object({
  entries: z.union([
    InputSchema, // Array of entries
    z.record(
      z.object({
        name: z.string(),
        position: z.string().optional(),
        department: z.string().optional(),
        extension: z.string().optional(),
        number: z.string().optional(),
        email: z.string().optional(),
      })
    ), // Object with entry values
  ]),
});

// Output validation schema for individual directory entries
const DirectoryEntrySchema = z.object({
  name: z.string(),
  position: z.string(),
  department: z.enum([
    "Management",
    "Sales",
    "Service",
    "Parts",
    "Finance",
    "Accounting",
    "Logistics",
  ]),
  extension: z.string(),
  number: z.string(),
  email: z.string().optional(),
});

// Wrapper schema to encapsulate the array within an object
const DirectoryEntriesWrapperSchema = z.object({
  directory_entries: DirectoryEntrySchema.array(),
});

// OpenAI client setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate the prompt
const generatePrompt = (entries: z.infer<typeof InputSchema>) => `
You are a data normalization assistant for a car dealership directory. Analyze and normalize the following directory entries to ensure consistency.

**Rules:**
1. Normalize the department name to one of these: Management, Sales, Service, Parts, Finance, Accounting, Logistics.
2. Standardize the position title to a professional format.
3. Keep the original name, extension, phone number, and email unchanged.

**Input Directory:**
\`\`\`json
${JSON.stringify(entries, null, 2)}
\`\`\`

**Output Format:** JSON object with a key "directory_entries" containing an array of entries. Each entry should include:
- "name": Original name.
- "position": Standardized position.
- "department": Normalized department.
- "extension": Original extension.
- "number": Original phone number.
- "email": Original email.

**Return only valid JSON as output.**
`;

export async function POST(req: Request) {
  try {
    // Ensure the OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API Key.");
    }

    // Parse and validate input data using the wrapper schema
    const rawEntries = await req.json();
    const parsedRawEntries = InputWrapperSchema.parse(rawEntries);
    const rawEntriesArray = parsedRawEntries.entries;

    // Convert raw entries into the expected array structure
    const entries: z.infer<typeof InputSchema> = Array.isArray(rawEntriesArray)
      ? rawEntriesArray
      : Object.values(rawEntriesArray).map((entry) => ({
          name: entry.name,
          position: entry.position ?? "",
          department: entry.department ?? "",
          extension: entry.extension ?? "",
          number: entry.number ?? "",
          email: entry.email ?? "",
        }));

    // Validate entries
    InputSchema.parse(entries);

    // Ensure the input entries are not empty
    if (entries.length === 0) {
      return NextResponse.json(
        { error: "No directory entries provided." },
        { status: 400 }
      );
    }

    // Generate the prompt
    const prompt = generatePrompt(entries);

    // Make OpenAI API call with structured response
    const completion = await openai.beta.chat.completions.parse({
      model: "o1-preview",
      messages: [
        { role: "system", content: "You are a data normalization assistant." },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(
        DirectoryEntriesWrapperSchema,
        "directory_entries"
      ),
    });

    // Extract the processed entries
    const processedEntries = completion.choices[0].message.parsed;

    // Return the processed entries as the response
    return NextResponse.json(processedEntries);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error processing directory data:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });

    return NextResponse.json(
      { error: "Failed to process directory data" },
      { status: 500 }
    );
  }
}
