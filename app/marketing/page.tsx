import React from "react";
import Navbar from "./(components)/Navbar";
import Image from "next/image";
import { HighlightedOne } from "./(components)/HighlightedOne";
import { StartNowButton } from "./(components)/StartNowButton";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section - Above the Fold */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-6xl py-20 sm:py-32">
          <div className="text-center">
            {/* Immediate Social Proof */}
            <div className="flex justify-center">
              <div className="mb-8 inline-flex items-center rounded-full px-3 py-1 text-sm bg-blue-50 text-blue-700">
                <span className="font-semibold">Used in 1 Dealership!</span>
                <div className="ml-2 h-4 w-px bg-blue-200" />
                <span className="ml-2">Over 2+ Sales Reps Using Daily</span>
              </div>
            </div>

            {/* Clear, Simple Value Proposition */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8">
              Everything your sales team needs
              <span className="block text-3xl sm:text-5xl text-gray-600 font-normal">
                in <HighlightedOne /> place
              </span>
            </h1>

            {/* How We'll Create Value */}
            <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto mb-8">
              One organized hub that puts every dealership tool and resource at
              your sales teams fingertips. Less questions, more action.
            </p>

            {/* Strong CTA that Handles Objections */}
            <StartNowButton />
          </div>

          {/* Visual Proof */}
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <Image
                src="https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1ytJB7nFhmFD09AfBcVTik6SMvZC54ePUNr82z"
                alt="Unified dashboard with VIN lookup and tools"
                width={1024}
                height={680}
                priority
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold">BaseCamp</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 BaseCamp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
