import { Battery, Fuel, Settings, Zap } from "lucide-react";

export const phevFAQItems = [
  {
    id: "1",
    icon: Battery,
    title: "Electric Range",
    sub: "Pure electric driving range",
    content:
      "Volvo plug-in hybrids typically offer 30-40 miles of pure electric range when fully charged. This range is ideal for daily commuting and local trips.",
  },
  {
    id: "2",
    icon: Fuel,
    title: "Fuel Economy",
    sub: "Understanding MPG and MPGe",
    content:
      "PHEVs offer both MPG (gas) and MPGe (electric) ratings. When using both power sources, expect 50-60 MPGe combined. In hybrid mode without charging, expect 30-35 MPG.",
  },
  {
    id: "3",
    icon: Settings,
    title: "Drive Modes",
    sub: "Available driving modes",
    content:
      "Pure: Electric-only driving\nHybrid: Optimal combination of gas and electric\nPower: Maximum performance\nAWD: Enhanced traction\nOff-Road: Improved capability in rough terrain",
  },
  {
    id: "4",
    icon: Zap,
    title: "Charging",
    sub: "Charging options and times",
    content:
      "Level 2 charging (240V): 3-4 hours for full charge\nLevel 1 charging (120V): 6-8 hours for full charge\nThe gas engine can also charge the battery while driving",
  },
];
