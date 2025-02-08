import AdComparisonCard from './(components)/ad-comparison-card'

interface Ad {
  dealershipInfo: {
    name: string;
    location: string;
  };
  model: string;
  originalAd: {
    monthlyPayment: string;
    downPayment: string;
    details: string;
  };
  actualMeaning: {
    monthlyPayment: string;
    dueAtSigning: string;
    details: string[];
  };
}

const ads: Ad[] = [
  {
    dealershipInfo: {
      name: "Bomnin Volvo Cars Dadeland",
      location: "Miami, FL"
    },
    model: "2025 XC40 Core",
    originalAd: {
      monthlyPayment: "$449",
      downPayment: "$1,995",
      details: "Please note the following important details regarding the lease offer for the 2025 Volvo XC40 B5 Core: The advertised monthly payment of $449 is based on the Manufacturer's Suggested Retail Price (MSRP) of $43,665. This includes First payment, Bank Acquisition Fee $995, Dealer Fee $999, Tag Fees $250, Electronic Fee $399. Must qualify for Volvo Loyalty $1,000 Affinity/A-plan $500 and FWD to AWD Allowance of $1,000. The lease is for a term of 36 months, $1,995 Down Payment. Lessees are responsible for any excess wear and tear on the vehicle, as well as any mileage over 7,500 miles per year at a rate of $0.25 per mile. This offer is available only at Bomnin Volvo Cars Dadeland and is subject to vehicle availability. The vehicle shown in the advertisement may include optional equipment that is not included in the lease offer. Not all customers will qualify for this offer, and it is subject to change or cancellation at any time. Please see your Bomnin Volvo dealer for complete details. The offer is valid until 1/31/2025, and applicable vehicles may need to be ordered."
    },
    actualMeaning: {
      monthlyPayment: "$449",
      dueAtSigning: "$5,087",
      details: [
        "Advertised Monthly Payment: $449 (DOES NOT INCLUDE TAXES)",
        "Required Model: Must be XC40 B5 Core trim specifically",
        "MSRP Requirement: $43,665 (any options or higher trim levels will increase payment)",
        "Due at Signing: $5,087 (DOES NOT INCLUDE TAXES)",
        "Down Payment: $1,995",
        "First Month Payment: $449",
        "Bank Acquisition Fee: $995",
        "Dealer Fee: $999",
        "Tag Fees: $250",
        "Electronic Fee: $399",
        "Required Discounts (must qualify for ALL to get advertised payment):",
        "Volvo Loyalty: $1,000 (must be current Volvo owner)",
        "Affinity/A-plan: $500",
        "FWD to AWD Allowance: $1,000"
      ]
    }
  },
  {
    dealershipInfo: {
      name: "Bomnin Volvo Cars Dadeland",
      location: "Miami, FL"
    },
    model: "2025 XC60 Core",
    originalAd: {
      monthlyPayment: "$489",
      downPayment: "$1,995",
      details: "Please note the following important details regarding the lease offer for the 2025 Volvo XC60 B5 Core: The advertised monthly payment of $489 is based on the Manufacturer's Suggested Retail Price (MSRP) of $48,345. This includes First payment, Bank Acquisition Fee $995, Dealer Fee $999, Tag Fees $250, Electronic Fee $399. Must qualify for Volvo Loyalty $1,000 Affinity / A-plan $500 and FWD to AWD Allowance of $1,000. The lease is for a term of 36 months, $1,995 Down Payment. Lessees are responsible for any excess wear and tear on the vehicle, as well as any mileage over 7,500 miles per year at a rate of $0.25 per mile. This offer is available only at Bomnin Volvo Cars Dadeland and is subject to vehicle availability. The vehicle shown in the advertisement may include optional equipment that is not included in the lease offer. Not all customers will qualify for this offer, and it is subject to change or cancellation at any time. Please see your Bomnin Volvo dealer for complete details. The offer is valid until 1/31/2025, and applicable vehicles may need to be ordered."
    },
    actualMeaning: {
      monthlyPayment: "$489",
      dueAtSigning: "$5,127",
      details: [
        "Advertised Monthly Payment: $489 (DOES NOT INCLUDE TAXES)",
        "Required Model: Must be XC60 B5 Core trim specifically",
        "MSRP Requirement: $48,345 (any options or higher trim levels will increase payment)",
        "Due at Signing: $5,127 (DOES NOT INCLUDE TAXES)",
        "Down Payment: $1,995",
        "First Month Payment: $489",
        "Bank Acquisition Fee: $995",
        "Dealer Fee: $999",
        "Tag Fees: $250",
        "Electronic Fee: $399",
        "Required Discounts (must qualify for ALL to get advertised payment):",
        "Volvo Loyalty: $1,000 (must be current Volvo owner)",
        "Affinity/A-plan: $500",
        "FWD to AWD Allowance: $1,000"
      ]
    }
  },
  {
    dealershipInfo: {
      name: "Volvo Cars South Orlando",
      location: "Orlando, FL"
    },
    model: "2025 XC90 Core",
    originalAd: {
      monthlyPayment: "$549",
      downPayment: "$995",
      details: "Please note the following important details regarding the lease offer for the 2025 Volvo XC90 B5 Core: The advertised monthly payment of $549 is based on the Manufacturer's Suggested Retail Price (MSRP) of $59,565. This includes First payment, Bank Acquisition Fee $995, Dealer Fee $999, Tag Fees $250, Electronic Fee $399. Must qualify for Volvo Loyalty $1,000 Affinity / A-plan $500 and FWD to AWD Allowance of $1,000. The lease is for a term of 24 months, $995 Down Payment. Lessees are responsible for any excess wear and tear on the vehicle, as well as any mileage over 7,500 miles per year at a rate of $0.25 per mile. This offer is available only at Bomnin Volvo Cars Dadeland and is subject to vehicle availability. The vehicle shown in the advertisement may include optional equipment that is not included in the lease offer. Not all customers will qualify for this offer, and it is subject to change or cancellation at any time. Please see your Bomnin Volvo dealer for complete details. The offer is valid until 1/31/2025, and applicable vehicles may need to be ordered."
    },
    actualMeaning: {
      monthlyPayment: "$549",
      dueAtSigning: "$4,187",
      details: [
        "Advertised Monthly Payment: $549 (DOES NOT INCLUDE TAXES)",
        "Required Model: Must be XC90 B5 Core trim specifically",
        "MSRP Requirement: $59,565 (any options or higher trim levels will increase payment)",
        "Due at Signing: $4,187 (DOES NOT INCLUDE TAXES)",
        "Down Payment: $995 (lower than other models)",
        "First Month Payment: $549",
        "Bank Acquisition Fee: $995",
        "Dealer Fee: $999",
        "Tag Fees: $250",
        "Electronic Fee: $399",
        "Required Discounts (must qualify for ALL to get advertised payment):",
        "Volvo Loyalty: $1,000 (must be current Volvo owner)",
        "Affinity/A-plan: $500",
        "FWD to AWD Allowance: $1,000"
      ]
    }
  }
]

export default function Home() {
  // Group ads by dealership
  const groupedAds = ads.reduce((groups, ad) => {
    const dealerName = ad.dealershipInfo.name;
    if (!groups[dealerName]) {
      groups[dealerName] = [];
    }
    groups[dealerName].push(ad);
    return groups;
  }, {} as Record<string, Ad[]>);

  return (
    <main className="min-h-screen bg-[rgb(250,250,252)] py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-6xl font-bold mb-6">
            Finally.
          </h1>
          <h2 className="text-4xl font-bold mb-6">
            See what car lease ads really mean,<br />without the confusing fine print.
          </h2>
          <p className="text-xl text-gray-600">
            See the actual costs and requirements hidden in the fine print.<br />
            Expose the hidden costs and requirements.
          </p>
        </div>
        
        {/* Render ads grouped by dealership */}
        <div className="space-y-16">
          {Object.entries(groupedAds).map(([dealerName, dealerAds]) => (
            <div key={dealerName} className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {dealerName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dealerAds.map((ad, index) => (
                  <AdComparisonCard key={index} ad={ad} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

