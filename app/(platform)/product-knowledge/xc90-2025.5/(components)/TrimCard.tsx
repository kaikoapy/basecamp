import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

const TrimCard = ({
  title,
  features,
}: {
  title: string;
  features: { name: string; available: boolean }[];
}) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-3">
          <div
            className={`${feature.available ? "bg-green-50" : "bg-red-50"} p-2 rounded-full`}
          >
            {feature.available ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
          <span className="text-sm text-gray-600">{feature.name}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

const TrimDifferences = () => {
  const trims = [
    {
      title: "Core Trim",
      features: [
        { name: "Crystal Gear Selector", available: true },
        { name: "Tailored Leather Dashboard", available: true },
        { name: "Enhanced Sound Insulation", available: true },
        { name: "Premium Interior Materials", available: true },
        { name: "Nordico upholstery", available: true },
        { name: "Wireless phone charger", available: true },
        { name: "Leather seating", available: false },
        { name: "Platinum Grey color option", available: false },
      ],
    },
    {
      title: "Plus Trim",
      features: [
        { name: "Crystal Gear Selector", available: true },
        { name: "Tailored Leather Dashboard", available: true },
        { name: "Enhanced Sound Insulation", available: true },
        { name: "Integrated armrests and cupholders on 6s", available: true },
        { name: "Nordico upholstery", available: true },
        { name: "Wireless phone charger", available: true },
        { name: "Leather seating", available: false },
        { name: "Platinum Grey color option", available: false },
      ],
    },
    {
      title: "Ultra Trim",
      features: [
        { name: "Enhanced Sound Insulation", available: true },
        { name: "Premium Interior Materials", available: true },
        { name: "Wireless phone charger", available: true },
        { name: "Platinum Grey color option", available: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Trim Differences: 2025 vs 2025.5
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trims.map((trim, index) => (
          <TrimCard key={index} {...trim} />
        ))}
      </div>
    </div>
  );
};

export default TrimDifferences;
