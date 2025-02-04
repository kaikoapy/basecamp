import React, { useState } from "react";

interface LeaseDisclosure {
  advertisementOverview: {
    vehicleModel: string;
    advertisedMonthlyPayment: string;
    advertisedDownPayment: string;
  };
  finePrintSummary: {
    actuallyDueAtSigning: string;
    difference: string;
    monthlyPaymentDetail: string;
  };
  fullPaymentDetails: {
    paymentDetails: {
      monthlyPayment: string;
      downPayment: string;
      firstMonthPayment: string;
    };
    additionalFees: {
      bankAcquisitionFee: string;
      dealerFee: string;
      tagFees: string;
      electronicFee: string;
    };
    requiredDiscounts: {
      volvoLoyalty: string;
      affinityAplan: string;
      fwdToAwdAllowance: string;
    };
    vehicleRequirements: {
      model: string;
      msrp: string;
    };
  };
}

const LeaseDisclosureParser: React.FC = () => {
  const [disclosure, setDisclosure] = useState<string>("");
  const [parsedResult, setParsedResult] = useState<LeaseDisclosure | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setParsedResult(null);

    try {
      const response = await fetch("/api/parse-disclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disclosure }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred while parsing the disclosure.");
      }

      const data = await response.json();
      setParsedResult(data.structuredOutput);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ margin: "2rem auto", maxWidth: "800px", padding: "1rem" }}>
      <h1>Lease Disclosure Parser</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label htmlFor="disclosure">Enter Lease Disclosure Text:</label>
        <textarea
          id="disclosure"
          value={disclosure}
          onChange={(e) => setDisclosure(e.target.value)}
          placeholder="Paste the lease disclosure text here..."
          rows={10}
          style={{ width: "100%", padding: "0.5rem", fontFamily: "monospace" }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: "0.75rem", fontSize: "1rem" }}>
          {isLoading ? "Parsing..." : "Parse Disclosure"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {parsedResult && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Parsed Result:</h2>
          <pre
            style={{
              backgroundColor: "#f4f4f4",
              padding: "1rem",
              borderRadius: "5px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(parsedResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LeaseDisclosureParser;
