// app/api/parse-disclosure/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

// Instantiate the OpenAI client with your API key.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define a Zod schema for the lease disclosure structure.
const LeaseDisclosureSchema = z.object({
  advertisementOverview: z.object({
    vehicleModel: z.string(),
    advertisedMonthlyPayment: z.string(),
    advertisedDownPayment: z.string(),
  }),
  finePrintSummary: z.object({
    actuallyDueAtSigning: z.string(),
    difference: z.string(),
    monthlyPaymentDetail: z.string(),
  }),
  fullPaymentDetails: z.object({
    paymentDetails: z.object({
      monthlyPayment: z.string(),
      downPayment: z.string(),
      firstMonthPayment: z.string(),
    }),
    additionalFees: z.object({
      bankAcquisitionFee: z.string(),
      dealerFee: z.string(),
      tagFees: z.string(),
      electronicFee: z.string(),
    }),
    requiredDiscounts: z.object({
      volvoLoyalty: z.string(),
      affinityAplan: z.string(),
      fwdToAwdAllowance: z.string(),
    }),
    vehicleRequirements: z.object({
      model: z.string(),
      msrp: z.string(),
    }),
  }),
});

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON body to extract the lease disclosure text.
    const { disclosure } = await request.json();
    if (!disclosure || typeof disclosure !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid disclosure text." },
        { status: 400 }
      );
    }

    // Construct a prompt that instructs the model on which details to extract.
    const prompt = `
You are an expert at parsing lease disclosure texts and extracting detailed payment information in a structured JSON format. Your task is to extract the following details from the provided lease disclosure text and output a JSON object that exactly conforms to the schema below.

The required JSON schema is:

{
  "advertisementOverview": {
    "vehicleModel": string,
    "advertisedMonthlyPayment": string,
    "advertisedDownPayment": string
  },
  "finePrintSummary": {
    "actuallyDueAtSigning": string,
    "difference": string,
    "monthlyPaymentDetail": string
  },
  "fullPaymentDetails": {
    "paymentDetails": {
      "monthlyPayment": string,
      "downPayment": string,
      "firstMonthPayment": string
    },
    "additionalFees": {
      "bankAcquisitionFee": string,
      "dealerFee": string,
      "tagFees": string,
      "electronicFee": string
    },
    "requiredDiscounts": {
      "volvoLoyalty": string,
      "affinityAplan": string,
      "fwdToAwdAllowance": string
    },
    "vehicleRequirements": {
      "model": string,
      "msrp": string
    }
  }
}

**Important Guidelines:**
- Return your answer as a valid JSON object containing exactly the keys specified above. Do not include any additional keys or extra commentary.
- If any field is missing or cannot be clearly determined from the disclosure, output an empty string ("") for that field.
- Ensure that all values are strings and match the schema structure exactly.

Below is the lease disclosure text to process:
------------------------------------------------
${disclosure}
------------------------------------------------

For example, if all the data is available, your output should be structured like this:

{
  "advertisementOverview": {
    "vehicleModel": "2025 XC40 Core",
    "advertisedMonthlyPayment": "$449/month",
    "advertisedDownPayment": "$1995 down"
  },
  "finePrintSummary": {
    "actuallyDueAtSigning": "$5,087 due at signing",
    "difference": "$3,092.00 more than advertised",
    "monthlyPaymentDetail": "$449/month + Tax"
  },
  "fullPaymentDetails": {
    "paymentDetails": {
      "monthlyPayment": "$449/month + Tax",
      "downPayment": "$1995 down",
      "firstMonthPayment": "$995"
    },
    "additionalFees": {
      "bankAcquisitionFee": "$995",
      "dealerFee": "$999",
      "tagFees": "$250",
      "electronicFee": "$399"
    },
    "requiredDiscounts": {
      "volvoLoyalty": "$1,000",
      "affinityAplan": "$500",
      "fwdToAwdAllowance": "$1,000"
    },
    "vehicleRequirements": {
      "model": "2025 XC40 Core specifically",
      "msrp": "$43,665"
    }
  }
}

Return your answer as a JSON object matching the provided schema.
    `;

    // Call OpenAI's chat completion endpoint using the structured output support.
    const completion = await openai.beta.chat.completions.parse({
      model: "o3-mini-2025-1-31", // A model that supports structured outputs
      messages: [
        {
          role: "system",
          content:
            "You are an expert at parsing lease disclosure texts and extracting detailed payment information in a structured JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2, // Lower temperature for more deterministic output.
      response_format: zodResponseFormat(LeaseDisclosureSchema, "lease_disclosure"),
    });

    // The parsed output is available as:
    const structuredOutput = completion.choices[0].message.parsed;
    return NextResponse.json({ structuredOutput });
  } catch (error: unknown) {
    console.error("Error processing lease disclosure:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
