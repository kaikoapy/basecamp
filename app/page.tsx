import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Car,
  BarChart,
  Users2,
  Clock,
  Shield,
  Search,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-6xl py-20 sm:py-32">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="mb-8 inline-flex items-center rounded-full px-3 py-1 text-sm bg-blue-50 text-blue-700">
                <span className="font-semibold">New Feature</span>
                <div className="ml-2 h-4 w-px bg-blue-200" />
                <span className="ml-2">Integrated CRM System</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8">
              Modernize Your Dealership Operations
            </h1>
            <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto mb-8">
              DealerHub brings everything you need to manage your dealership in
              one place. From inventory management to customer relationships,
              we&apos;ve got you covered.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Book Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Inventory Management",
                description:
                  "Track your vehicles, manage listings, and sync across multiple platforms automatically.",
                icon: <Car className="h-6 w-6 text-blue-600" />,
              },
              {
                title: "Sales Analytics",
                description:
                  "Real-time insights into your sales performance, trends, and opportunities.",
                icon: <BarChart className="h-6 w-6 text-blue-600" />,
              },
              {
                title: "Customer CRM",
                description:
                  "Manage leads, track interactions, and boost customer retention.",
                icon: <Users2 className="h-6 w-6 text-blue-600" />,
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Dealerships Choose DealerHub
            </h2>
            <p className="text-gray-600">
              Trusted by leading dealerships across the country
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                stat: "50%",
                text: "Reduction in Administrative Tasks",
                icon: <Clock className="h-5 w-5 text-blue-600" />,
              },
              {
                stat: "100%",
                text: "Secure Data Protection",
                icon: <Shield className="h-5 w-5 text-blue-600" />,
              },
              {
                stat: "2x",
                text: "Faster Inventory Updates",
                icon: <Search className="h-5 w-5 text-blue-600" />,
              },
              {
                stat: "24/7",
                text: "Customer Support",
                icon: <Users2 className="h-5 w-5 text-blue-600" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <div className="text-3xl font-bold mb-2">{item.stat}</div>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to transform your dealership?
            </h2>
            <p className="mb-8 text-blue-100">
              Join leading dealerships who have modernized their operations with
              DealerHub
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              Start Your Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
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
