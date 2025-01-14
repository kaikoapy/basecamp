import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car } from "lucide-react";
import Navbar from "./(marketing)/(components)/Navbar";
import Image from "next/image";
import { HighlightedOne } from "@/components/HighlightedOne";

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
            <div className="flex flex-col items-center gap-4">
              <Button size="lg" className="gap-2">
                Start Now <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                This button doesn&apos;t do anything • yet
              </span>
            </div>
          </div>

          {/* Visual Proof */}
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <Image
                src="https://utfs.io/f/WTe1MV8FTP1y6c66a5izlvmXCscai1MT9SpUGERnFPV3k05g"
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
              <Car className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">DealerHub</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 DealerHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
