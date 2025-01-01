"use client";
import React from "react";
import {
  DollarSign,
  Calendar,
  ClipboardCheck,
  MessageCircle,
  AlertCircle,
  Tag,
  Car,
  Map,
  Plane,
} from "lucide-react";

const OverseasDeliverySalesGuide = () => {
  const sellingPoints = [
    {
      title: "Unique Experience Value",
      description:
        "Highlight the memorable experience of picking up their Volvo in Sweden - it's not just buying a car, it's creating a story they'll tell for years.",
      icon: Map,
    },
    {
      title: "Included Benefits",
      description:
        "Emphasize the included roundtrip tickets for two, hotel stay, and VIP delivery experience - helps justify the purchase decision.",
      icon: Tag,
    },
    {
      title: "European Road Trip",
      description:
        "Stress the opportunity to drive their new Volvo through Europe with included insurance and registration - a dream vacation for many.",
      icon: Car,
    },
    {
      title: "Factory Tour",
      description:
        "Mention the exclusive behind-the-scenes factory tour where available - builds brand connection and excitement.",
      icon: ClipboardCheck,
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Vehicle Selection & Configuration",
      description:
        "Work with customer to select from available models and configure their ideal build. Print out the build sheet for reference.",
    },
    {
      step: 2,
      title: "Timing & Deposit",
      description:
        "Place order at least 4 months before intended travel date. Collect $3,000 non-refundable deposit to initiate the order.",
    },
    {
      step: 3,
      title: "Payment Method",
      description:
        "Cash purchase or financing available (no leasing). Note: If financing, payments may start before vehicle delivery due to shipping time. Final payment for your new Volvo is due 30 days prior to traveling to Sweden. ",
    },
    {
      step: 4,
      title: "Trade-In Handling",
      description:
        "If customer has a trade-in, it must be completed before receiving the new vehicle stateside.",
    },
    {
      step: 5,
      title: "Order Processing",
      description: "Sales manager processes the order in the system.",
    },
    {
      step: 6,
      title: "Trip Planning",
      description:
        "Volvo concierge team contacts customer within 30 days to plan trip details and arrangements.",
    },
    {
      step: 7,
      title: "European Delivery & Travel",
      description:
        "Customer travels to Sweden, receives vehicle, and enjoys European driving experience.",
    },
    {
      step: 8,
      title: "Vehicle Return & Shipping",
      description:
        "Vehicle is shipped back to the originating retailer where customer will complete final delivery.",
    },
  ];

  const commonObjections = [
    {
      objection: "It seems complicated to arrange everything",
      response:
        "Emphasize that we handle all the logistics - from travel arrangements to shipping. Our concierge service makes it seamless.",
    },
    {
      objection: "I can't take that much time off for vacation",
      response:
        "The minimum trip can be as short as 3-4 days. Many customers combine it with already planned European travel.",
    },
    {
      objection: "Why not just buy the car here?",
      response:
        "Frame it as getting a European vacation experience included with their Volvo purchase. The memories are priceless.",
    },
    {
      objection: "What about the deposit?",
      response:
        "The $3,000 deposit is applied to the final purchase price - it's not an additional cost.",
    },
  ];

  const availableModels = [
    "XC60 (Including PHEV)",
    "XC90 (Including PHEV)",
    "XC40 (Excluding Recharge)",
    "V60 Cross Country",
    "V90 Cross Country",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">
            Overseas Delivery Sales Guide
          </h1>
          <p className="text-xl">
            Everything you need to know to sell the Overseas Delivery Program
            effectively
          </p>
        </div>
      </div>

      {/* Quick Reference Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 py-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>$3,000 deposit required</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>4-month lead time</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-purple-600" />
              <span>Includes flights for two</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Key Selling Points */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Key Selling Points</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sellingPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg"
                >
                  <point.icon className="w-6 h-6 text-blue-600" />
                  <h3 className="font-medium">{point.title}</h3>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Process Steps */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">
              How It Works - Step by Step
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Two Column Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Available Models */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Available Models</h2>
              <div className="space-y-3">
                {availableModels.map((model, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                  >
                    <Car className="w-5 h-5 text-blue-600" />
                    <span>{model}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Common Objections */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">
                Handling Common Objections
              </h2>
              <div className="space-y-4">
                {commonObjections.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium text-red-600 mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {item.objection}
                    </div>
                    <p className="text-sm text-gray-600">{item.response}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Resource Links */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Quick Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="https://volvoexperiences.com/"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <Map className="w-5 h-5" />
                Volvo Experiences
              </a>
              <a
                href="https://homeshipment.volvoprograms.com/#program"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <Car className="w-5 h-5" />
                Home Shipment Details
              </a>
              <a
                href="https://www.youtube.com/watch?v=3JGDOjY7Cqg"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                  <path
                    fill="white"
                    d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
                Watch Program Video
              </a>
            </div>
          </section>

          {/* Email Template */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Email Template</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {`Subject: Volvo Overseas Delivery Program - Quick Overview & Resources

Dear [Customer Name],

Thank you for your interest in the Volvo Overseas Delivery Program. Here's a quick summary of what we discussed and helpful resources for you to explore:

PROGRAM HIGHLIGHTS:
• Pick up your new Volvo in Gothenburg, Sweden
• Includes round-trip tickets for two
• 2-night hotel stay*
• VIP delivery experience at World of Volvo
• European insurance & registration included
• Shipping back to our dealership included

KEY POINTS TO REMEMBER:
• $3,000 non-refundable deposit required
• Order needs to be placed ~4 months before desired travel time
• Vehicle must leave Europe within 6 months of delivery
• Shipping time back to US is approximately 6-8 weeks

HELPFUL RESOURCES:
• Program Overview & Trip Planning: https://volvoexperiences.com/
• Shipping Details & Drop-off Locations: https://homeshipment.volvoprograms.com/#program
• Program Video Overview: https://www.youtube.com/watch?v=3JGDOjY7Cqg

NEXT STEPS:
1. Review the resources above
2. Consider your preferred travel dates
3. Think about your ideal vehicle configuration
4. Let me know if you'd like to proceed with placing an order

For any questions about the program:
Overseas Delivery Support: 800.631.1667 or overseas@volvoforlife.com

For travel arrangements:
ADTRAV Vacations: 833.710.0842 or volvo.travel@adtrav.com

Please don't hesitate to reach out if you have any questions. I'm here to help make this a memorable experience for you.

Best regards,
[Your Name]
[Dealership Name]
[Your Contact Info]`}
              </pre>
            </div>
            <button
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition flex items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(
                  document.querySelector("pre")?.textContent || ""
                );
              }}
            >
              <ClipboardCheck className="w-4 h-4" />
              Copy Template
            </button>
          </section>

          {/* Support Contact Info */}
          <section className="bg-blue-50 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Support Contacts</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-lg mb-2">
                  Overseas Delivery Support
                </h3>
                <p>800.631.1667</p>
                <p>overseas@volvoforlife.com</p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">
                  Travel Arrangements
                </h3>
                <p>833.710.0842</p>
                <p>volvo.travel@adtrav.com</p>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section className="bg-yellow-50 rounded-lg p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <h2 className="font-bold mb-2">Important Reminders</h2>
                <ul className="space-y-2">
                  <li>
                    • Tourist vehicles must be exported from EU within 6 months
                    from delivery date
                  </li>
                  <li>• Factory tours cannot always be guaranteed</li>
                  <li>
                    • Additional fees apply for drop-off locations other than
                    Gothenburg
                  </li>
                  <li>
                    • Core travel package is included; additional activities are
                    customer&apos;s responsibility. Customers with a Volvo will
                    get a 2nd night hotel stay included.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OverseasDeliverySalesGuide;
