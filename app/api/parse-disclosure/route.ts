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
  dealershipInfo: z.object({
    name: z.string(),
    location: z.string().optional(),
  }),
  advertisementOverview: z.object({
    vehicleModel: z.string(),
    advertisedMonthlyPayment: z.string(),
    advertisedDownPayment: z.string(),
    isTransparent: z.boolean(),
  }),
  finePrintSummary: z.object({
    // These fields will be computed/inferred if not explicitly extracted.
    actuallyDueAtSigning: z.string(),
    difference: z.string(),
    monthlyPaymentDetail: z.string(),
    originalDisclosure: z.string(),
    includedFeesInAdvertised: z.array(z.string()),
  }),
  fullPaymentDetails: z.object({
    paymentDetails: z.object({
      monthlyPayment: z.string(),
      downPayment: z.string(),
      firstMonthPayment: z.string(),
      leaseTerm: z.string(),
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
      mileageLimit: z.string(),
    }),
  }),
});

export async function POST(request: Request) {
  try {
    const { disclosure, isTransparent } = await request.json();
    if (!disclosure || typeof disclosure !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid disclosure text." },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert at analyzing lease disclosures and extracting detailed payment information in a structured JSON format.

Key Analysis Tasks:
1. Extract the dealership name and location from the disclosure
2. The transparency has already been determined by the user: ${isTransparent}
3. Extract all standard lease details with special attention to:
   - For transparent ads: fees are already included in the advertised due at signing amount
   - For non-transparent ads: fees are additional to the advertised amount
   - Required discounts and qualifications
   - Vehicle requirements
   - For mileage limit, return only the number (e.g., "7,500" instead of "7,500 miles per year")

Important Note for Transparent Ads:
- When isTransparent is true, the actuallyDueAtSigning should be the advertised down payment plus first month's payment
- The difference should be "0" for transparent ads
- Fees listed are informational only and are already included in the advertised amount

The required JSON schema is:
{
  "dealershipInfo": {
    "name": string,
    "location": string
  },
  "advertisementOverview": {
    "vehicleModel": string,
    "advertisedMonthlyPayment": string,
    "advertisedDownPayment": string,
    "isTransparent": boolean
  },
  "finePrintSummary": {
    "actuallyDueAtSigning": string,
    "difference": string,
    "monthlyPaymentDetail": string,
    "originalDisclosure": string,
    "includedFeesInAdvertised": string[]
  },
  "fullPaymentDetails": {
    "paymentDetails": {
      "monthlyPayment": string,
      "downPayment": string,
      "firstMonthPayment": string,
      "leaseTerm": string
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
      "msrp": string,
      "mileageLimit": string
    }
  }
}

Below is the lease disclosure text to process:
------------------------------------------------
${disclosure}
------------------------------------------------

Return your answer as a JSON object matching the provided schema. Extract the dealership name and location from the text. Use the provided isTransparent value (${isTransparent}) in the advertisementOverview.isTransparent field. Remember that for transparent ads, the actuallyDueAtSigning should only be the advertised down payment plus first month's payment, and the difference should be "0".
    `;

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing lease disclosures and extracting detailed payment information.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      response_format: zodResponseFormat(LeaseDisclosureSchema, "lease_disclosure"),
    });

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
