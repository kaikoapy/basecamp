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
    // Parse the incoming JSON body to extract the lease disclosure text.
    const { disclosure } = await request.json();
    if (!disclosure || typeof disclosure !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid disclosure text." },
        { status: 400 }
      );
    }

    // Construct a prompt that instructs the model on which details to extract
    // and how to infer missing values based on related data.
    const prompt = `
You are an expert at analyzing lease disclosures for transparency and extracting detailed payment information in a structured JSON format.

Key Analysis Tasks:
1. Determine if the advertisement is transparent:
   - Set isTransparent to true when BOTH of these conditions are met:
     A. Uses clear "total due" language:
        * "Total of $X due at inception/signing"
        * States a total amount first, then breaks it down
     
     B. AND Explicitly itemizes all components that sum to that total:
        * "this includes [list where amounts sum to total]"
        * Lists every fee and amount that makes up the total
        * No mention of additional fees beyond the itemized amounts
   
   Example of a Transparent Ad:
   "Total of $3,995.00 due at Inception, this includes: $1,427.00 Cap Cost Reduction, Dealer Fee $999, Bank Acquisition Fee $995, Tag Fee $175, Electronic Filing Fee $399 (where these components sum to $3,995)"

   NOT Transparent when:
   - States a total but doesn't break down all components
   - Lists fees separately from the "due at signing" amount
   - Uses "down payment" instead of "total due"
   - Mentions additional fees in disclaimers
   - When components don't sum to the advertised total

2. Extract all standard lease details with special attention to:
   - Verify that itemized amounts actually sum to the advertised total
   - Look for any fees mentioned outside the main breakdown
   - Required discounts and qualifications
   - Vehicle requirements

Note: For the XC90 example ($3,995 total with itemized fees that sum correctly), 
this should be marked as transparent because it:
1. States "Total of $3,995.00 due at Inception"
2. Uses "this includes" followed by complete itemization
3. Lists all components that sum to $3,995
4. Has no mention of additional fees beyond those listed

The required JSON schema is:
{
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

Example for a transparent ad:
{
  "advertisementOverview": {
    "isTransparent": true,
    "advertisedDownPayment": "$3,995",
    ...
  },
  "finePrintSummary": {
    "includedFeesInAdvertised": [
      "Cap Cost Reduction",
      "Dealer Fee",
      "Bank Acquisition Fee",
      "Tag Fee",
      "Electronic Filing Fee"
    ],
    ...
  }
}

Below is the lease disclosure text to process:
------------------------------------------------
${disclosure}
------------------------------------------------

Return your answer as a JSON object matching the provided schema.
    `;

    // Call OpenAI's chat completion endpoint using the structured output support.
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing lease disclosures for transparency and extracting detailed payment information.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
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
