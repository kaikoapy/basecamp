import { Battery, Gauge, Timer, Wrench } from "lucide-react";

export const evFAQItems = [
  {
    id: "1",
    icon: Battery,
    title: "Charging",
    sub: "Understanding charging options and times",
    content:
      "Volvo EVs can be charged at home using a Level 2 charger or at public DC fast charging stations. A Level 2 home charger typically takes 8-10 hours for a full charge, while DC fast charging can charge up to 80% in around 40 minutes.",
  },
  {
    id: "2",
    icon: Gauge,
    title: "Range",
    sub: "Vehicle range and efficiency",
    content:
      "Volvo's electric vehicles offer ranges between 200-300 miles depending on the model. Actual range varies based on driving conditions, climate, terrain, and use of climate control systems.",
  },
  {
    id: "3",
    icon: Timer,
    title: "Charging Times",
    sub: "Expected charging durations",
    content:
      "DC Fast Charging (150kW): 10-80% in ~40 minutes\nAC Home Charging (11kW): 0-100% in ~8 hours\nPortable Charger (120V): ~4 miles of range per hour",
  },
  {
    id: "4",
    icon: Wrench,
    title: "Maintenance",
    sub: "EV maintenance requirements",
    content:
      "Electric vehicles require less maintenance than conventional vehicles. Regular service includes tire rotation, brake fluid checks, cabin air filter replacement, and software updates.",
  },
];
