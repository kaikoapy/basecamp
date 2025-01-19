"use client";

import { ExternalLink } from "lucide-react";

const dealerStores = [
  {
    name: "Schumacher Palm Beaches",
    url: "https://www.volvoofthepalmbeaches.com/new-inventory/index.htm",
  },
  {
    name: "Gunther Coconut Creek",
    url: "https://www.gunthervolvocars.net/new-inventory/index.htm",
  },
  {
    name: "Wallace Volvo Cars",
    url: "https://www.wallacevolvocars.com/new-vehicles/",
  },
  {
    name: "Volvo Cars of Naples",
    url: "https://www.volvocarsofnaples.com/new-inventory/index.htm",
  },
  {
    name: "Weston Volvo",
    url: "https://www.westonvolvocars.com/new-inventory/index.htm",
  },
  {
    name: "Volvo Tampa",
    url: "https://www.volvocarstampa.com/new-inventory/index.htm",
  },
  {
    name: "Volvo Fort Myers",
    url: "https://www.mcgrathvolvocarsoffortmyers.com/new-inventory/index.htm",
  },
  {
    name: "Volvo Gunther Delray",
    url: "https://www.volvocarsdelray.com/new-inventory/index.htm",
  },
];

export default function DealerTradeStores() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dealer Trade Stores
        </h1>
        <p className="mt-2 text-gray-600">
          Quick access to inventory at nearby Volvo dealerships
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {dealerStores.map((store) => (
          <a
            key={store.name}
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 bg-white rounded-lg border border-gray-200 
              hover:border-blue-500 hover:shadow-md transition-all duration-200
              flex items-center justify-between"
          >
            <span className="text-gray-900 group-hover:text-blue-600 font-medium pr-2">
              {store.name}
            </span>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
          </a>
        ))}
      </div>
    </div>
  );
}
