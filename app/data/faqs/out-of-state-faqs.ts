import { Car, FileText, MapPin, Wallet } from "lucide-react";

export const outOfStateFAQItems = [
  {
    id: "1",
    icon: MapPin,
    title: "Registration Requirements",
    sub: "State-specific documentation",
    content:
      "Different states have varying requirements for vehicle registration. We'll help coordinate with your local DMV and ensure all necessary documentation is prepared.",
  },
  {
    id: "2",
    icon: Wallet,
    title: "Taxes and Fees",
    sub: "Understanding costs",
    content:
      "Sales tax is typically paid in your state of residence. Additional fees may include registration, title, and documentation fees which vary by state.",
  },
  {
    id: "3",
    icon: Car,
    title: "Delivery Options",
    sub: "Vehicle transport services",
    content:
      "We offer both enclosed and open transport options for vehicle delivery. Alternatively, you can arrange your own shipping or pick up the vehicle in person.",
  },
  {
    id: "4",
    icon: FileText,
    title: "Documentation",
    sub: "Required paperwork",
    content:
      "Required documents include: Valid ID, Proof of insurance, Proof of residence, Payment verification. Additional documents may be required based on your state.",
  },
];
