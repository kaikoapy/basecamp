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
          <span className="text-sm text-gray-800">{feature.name}</span>
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
        { name: "11.2\" Center Display", available: true },
        { name: "Park Assist Camera", available: true },
        { name: "Front & Rear Sensors", available: true },
        { name: "Adaptive Cruise Control", available: false },
      ],
    },
    {
      title: "Plus Trim",
      features: [
        { name: "11.2\" Center Display", available: true },
        { name: "Park Assist Camera", available: true },
        { name: "Front & Rear Sensors", available: true },
        { name: "Adaptive Cruise Control", available: true },
        { name: "Black Edition Options", available: true },
      ],
    },
    {
      title: "Ultra Trim",
      features: [
        { name: "11.2\" Center Display", available: true },
        { name: "Park Assist Camera", available: true },
        { name: "Front & Rear Sensors", available: true },
        { name: "Adaptive Cruise Control", available: true },
        { name: "Black Edition Options", available: true },
        { name: "Black Roof (XC40)", available: true },
        { name: "Heat Pump (EX40/EC40)", available: true },
      ],
    },
  ];

  return (
    <div className="space-y-6 px-6">
      <h2 className="text-2xl font-semibold">
        MY26 Trim Features
      </h2>
      <p className="text-muted-foreground">
        Standard and available features across MY26 trim levels
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trims.map((trim, index) => (
          <TrimCard key={index} {...trim} />
        ))}
      </div>
    </div>
  );
};

export default TrimDifferences;
