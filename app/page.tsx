import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Car,
  Search,
  Users2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Navbar from "./(marketing)/(components)/Navbar";
import Image from "next/image";
import { HighlightedOne } from "@/components/HighlightedOne";
import { HighlightedNumber } from "@/components/HighlightedNumber";

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
                <span className="font-semibold">
                  Trusted by 50+ Dealerships
                </span>
                <div className="ml-2 h-4 w-px bg-blue-200" />
                <span className="ml-2">2,000+ Sales Reps Using Daily</span>
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
                Start Free 30-Day Trial <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                No credit card required • Set up in 10 minutes
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
              {/* Floating Proof Points */}
              <div className="absolute -top-4 -left-4 bg-white shadow-lg rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">
                    45 min saved daily per rep
                  </span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white shadow-lg rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">
                    Instant tool access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Visual Proof Section */}
      <div className="mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Without DealerHub Column */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">Without DealerHub</h3>

              {/* New Hires Pain Points */}
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3">
                  New Hires Struggle
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-red-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      2+ weeks to get fully operational
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Search className="h-5 w-5 text-red-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      Constantly hunting for basic information
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users2 className="h-5 w-5 text-red-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      Interrupting managers 12+ times daily
                    </span>
                  </li>
                </ul>
              </div>

              {/* Existing Team Pain Points */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3">
                  Existing Team Frustrated
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-red-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      45+ minutes daily searching for tools
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Search className="h-5 w-5 text-red-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      15+ bookmarks to remember
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users2 className="h-5 w-5 text-red-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      20+ interruptions from new hires
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* With DealerHub Column */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">With DealerHub</h3>

              {/* New Hires Benefits */}
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3">
                  New Hires Thrive
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      Fully operational in 3 days
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      Self-guided resource center
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      90% fewer questions to management
                    </span>
                  </li>
                </ul>
              </div>

              {/* Existing Team Benefits */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3">
                  Existing Team Empowered
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      Everything accessible in 2 clicks
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      One login for all tools
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <span className="text-sm text-gray-600">
                      80% fewer daily interruptions
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Metrics Below */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-1">75%</div>
              <div className="text-sm text-gray-600">
                Faster New Hire Training
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-1">45min</div>
              <div className="text-sm text-gray-600">Saved Daily Per Rep</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-1">90%</div>
              <div className="text-sm text-gray-600">Fewer Questions</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold mb-1">
                <HighlightedNumber number="1" />
              </div>
              <div className="text-sm text-gray-600">Login for All Tools</div>
            </div>
          </div>
        </div>
      </div>
      {/* Social Proof that Inspires Action */}
      <div className="py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              From Chaos to Clarity: The DealerHub Revolution
            </h2>
            <p className="text-gray-600">
              Peek into how dealerships are turning the tables with our
              software... or so they tell us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/api/placeholder/64/64"
                  alt="Capital Motors"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">Capital Motors</p>
                  <p className="text-sm text-gray-500">
                    30+ Sales Reps (All Now Part-Time Efficiency Gurus)
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                &quot;Training? We&apos;ve cut it down to a science. New reps
                now go from zero to hero in three days flat, thanks to
                DealerHub. They&apos;re so efficient, they might start selling
                cars in their sleep.&quot;
              </p>
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Training Time</span>
                  <span className="text-green-600">
                    ↓ 75% Less Time Wasted, More Time Selling
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/api/placeholder/64/64"
                  alt="Premier Auto"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">Premier Auto Group</p>
                  <p className="text-sm text-gray-500">
                    25+ Sales Reps (Now With Superhuman Memory)
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                &quot;We&apos;ve turned time into gold. With DealerHub, reps no
                longer spend hours on treasure hunts for tools. That&apos;s an
                extra 180 hours a month to seal deals, not just hunt for them.
                &quot;
              </p>
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Monthly Time Saved</span>
                  <span className="text-green-600">
                    180+ Hours of Selling, Not Searching
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Founder's Note */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="/api/placeholder/80/80"
                alt="Founder"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">
                  From the Sales Floor to the Tech Throne
                </h3>
                <p className="text-gray-600">
                  Alex Chen, Former Sales Maverick & Founder of DealerHub
                </p>
              </div>
            </div>
            <p className="text-lg text-gray-600 mb-6">
              &quot;After years on the sales floor, I knew the drill:
              everyone&apos;s looking for something - the right tool, the right
              pitch, or just the nearest coffee. But with DealerHub, we&apos;ve
              turned that search into a success story.&quot;
            </p>
            <p className="text-lg text-gray-600 mb-6">
              &quot;New hires used to drown in paperwork, and even the pros were
              playing hide-and-seek with resources. Now, DealerHub puts
              everything at their fingertips, so they can focus on what they do
              best - selling cars like there&apos;s no tomorrow.&quot;
            </p>
            <p className="text-lg text-gray-600">
              &quot;I created this to transform our dealerships into efficiency
              machines, where every second counts, and every sale is just a
              click away. Welcome to the new age of car sales - where the only
              thing you&apos;re looking for is your next big win.&quot;
            </p>
          </div>
        </div>
      </div>
      {/* Final CTA */}
      <div className="bg-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to empower your sales team?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Join 50+ dealerships saving 180+ hours monthly with DealerHub
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Your Free 30-Day Trial <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-sm text-blue-200">
                No credit card required • Full access to all features
              </span>
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
              © 2024 DealerHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
