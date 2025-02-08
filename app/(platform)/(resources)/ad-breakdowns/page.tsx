"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AdComparisonCard from './(components)/ad-comparison-card'

export default function Home() {
  // Use Convex query to fetch ads grouped by dealership
  const adsByDealership = useQuery(api.ads.getByDealership);

  if (!adsByDealership) {
    return (
      <div className="min-h-screen bg-[rgb(250,250,252)] py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <p>Loading ads...</p>
          </div>
        </div>
      </div>
    );
  }

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
          {Object.entries(adsByDealership).map(([dealerName, dealerAds]) => (
            <div key={dealerName} className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {dealerName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dealerAds.map((ad) => (
                  <AdComparisonCard key={ad._id} ad={ad} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

