"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Car,
  Wrench,
  Headset,
  CarFront,
  Package,
  SquareParking,
  Store,
  PersonStanding,
  Receipt,
  CircleParking,
  Crown,
  Droplets,
} from "lucide-react";

// Color mapping for different location types
const locationColors = {
  "New Cars": {
    bg: "bg-blue-500",
    text: "text-blue-500",
    border: "border-blue-500",
    icon: Car,
  },
  "Accounting Parking": {
    bg: "bg-purple-500",
    text: "text-purple-500",
    border: "border-purple-500",
    icon: CircleParking,
  },
  "Service Drive": {
    bg: "bg-red-500",
    text: "text-red-500",
    border: "border-red-500",
    icon: Wrench,
  },
  BDC: {
    bg: "bg-green-500",
    text: "text-green-500",
    border: "border-green-500",
    icon: Headset,
  },
  "Used Cars": {
    bg: "bg-orange-500",
    text: "text-orange-500",
    border: "border-orange-500",
    icon: CarFront,
  },
  "Parts Department": {
    bg: "bg-yellow-500",
    text: "text-yellow-500",
    border: "border-yellow-500",
    icon: Package,
  },
  "Lease Returns": {
    bg: "bg-pink-500",
    text: "text-pink-500",
    border: "border-pink-500",
    icon: SquareParking,
  },
  Showroom: {
    bg: "bg-indigo-500",
    text: "text-indigo-500",
    border: "border-indigo-500",
    icon: Store,
  },
  "Porters Office": {
    bg: "bg-cyan-500",
    text: "text-cyan-500",
    border: "border-cyan-500",
    icon: PersonStanding,
  },
  Accounting: {
    bg: "bg-violet-500",
    text: "text-violet-500",
    border: "border-violet-500",
    icon: Receipt,
  },
  "Customer Parking": {
    bg: "bg-emerald-500",
    text: "text-emerald-500",
    border: "border-emerald-500",
    icon: CircleParking,
  },
  "Manager Parking": {
    bg: "bg-rose-500",
    text: "text-rose-500",
    border: "border-rose-500",
    icon: Crown,
  },
  "Car Wash": {
    bg: "bg-teal-500",
    text: "text-teal-500",
    border: "border-teal-500",
    icon: Droplets,
  },
} as const;

type LocationType = keyof typeof locationColors;

// Define the structure for our location markers
interface LocationMarker {
  id: number;
  x: number;
  y: number;
  title: LocationType;
  description: string;
}

// Sample location data - adjust coordinates as needed
const locations: LocationMarker[] = [
  {
    id: 1,
    x: 46,
    y: 52,
    title: "New Cars",
    description: "New Car Parking",
  },
  {
    id: 2,
    x: 46,
    y: 30,
    title: "Accounting Parking",
    description: "Accounting Parking M-F. Open to sales on weekends.",
  },
  {
    id: 3,
    x: 57,
    y: 36,
    title: "Service Drive",
    description: "Service Center",
  },
  {
    id: 4,
    x: 57,
    y: 28,
    title: "BDC",
    description: "BDC Office",
  },
  {
    id: 5,
    x: 57,
    y: 53,
    title: "Used Cars",
    description: "Used Car Parking",
  },
  {
    id: 6,
    x: 61,
    y: 29,
    title: "Parts Department",
    description: "Parts Department",
  },
  {
    id: 7,
    x: 68,
    y: 72,
    title: "New Cars",
    description: "New Car Parking",
  },
  {
    id: 8,
    x: 25,
    y: 18,
    title: "Lease Returns",
    description: "Lease Return Parking & employee parking",
  },
  {
    id: 9,
    x: 57,
    y: 72,
    title: "Showroom",
    description: "Showroom",
  },
  {
    id: 10,
    x: 57,
    y: 45,
    title: "Porters Office",
    description: "Porters Office & Vending machine",
  },
  {
    id: 11,
    x: 42,
    y: 18,
    title: "Accounting",
    description: "Accounting and titling offices",
  },
  {
    id: 12,
    x: 64,
    y: 72,
    title: "Customer Parking",
    description: "Customer Parking",
  },
  {
    id: 13,
    x: 57,
    y: 59,
    title: "Manager Parking",
    description: "Manager Parking",
  },
  {
    id: 14,
    x: 36,
    y: 17,
    title: "Car Wash",
    description: "Car Wash",
  },
  {
    id: 15,
    x: 57,
    y: 63,
    title: "Customer Parking",
    description: "Customer Parking",
  },
  {
    id: 16,
    x: 60,
    y: 15,
    title: "New Cars",
    description: "New Car Parking",
  },
];

function MapKey() {
  return (
    <div className="mt-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="font-bold text-lg mb-3">Map Legend</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(locationColors).map(([title, colors]) => {
          const Icon = colors.icon;
          return (
            <div key={title} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full bg-white border-2 ${colors.border} flex items-center justify-center`}
              >
                <Icon className={`w-4 h-4 ${colors.text}`} />
              </div>
              <span className="text-sm text-gray-700">{title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationMarker | null>(null);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle developer mode keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        setIsDeveloperMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setSelectedLocation(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-6">
      {/* Container for the image and markers */}
      <div className="relative">
        <Image
          src="https://utfs.io/f/WTe1MV8FTP1yhJAJOGuJpeyjWPSn2v3rc0zk71VadbIi4CGw"
          alt="Aerial view of dealership"
          width={1200}
          height={800}
          className="w-full h-auto"
        />

        {isDeveloperMode && (
          <div className="absolute left-4 top-4 bg-black/80 text-white px-3 py-1 rounded-md text-sm">
            Developer Mode
          </div>
        )}

        {/* Markers */}
        {locations.map((location) => {
          const LocationIcon = locationColors[location.title].icon;
          return (
            <button
              key={location.id}
              className={`absolute flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-md 
                       transition-all duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                       text-sm font-bold group overflow-hidden
                       ${locationColors[location.title].border}
                       ${locationColors[location.title].bg}`}
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLocation(location);
              }}
              aria-label={`View information about ${location.title}`}
            >
              <div
                className={`absolute inset-0 bg-white transition-opacity duration-200
                ${selectedLocation?.id === location.id ? "opacity-0" : "group-hover:opacity-0"}`}
              />
              {isDeveloperMode ? (
                <span className="relative z-20 text-white">{location.id}</span>
              ) : (
                <LocationIcon
                  className={`w-5 h-5 relative z-20
                    ${
                      selectedLocation?.id === location.id
                        ? "text-white"
                        : `${locationColors[location.title].text} group-hover:text-white`
                    }`}
                />
              )}
            </button>
          );
        })}

        {/* Popup */}
        {selectedLocation && (
          <div
            ref={popupRef}
            className="absolute z-10 bg-white rounded-lg shadow-lg p-4 w-64 border border-gray-200"
            style={{
              left: `${selectedLocation.x}%`,
              top: `${selectedLocation.y + 5}%`,
              transform: "translate(-50%, 0)",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLocation(null);
              }}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              aria-label="Close popup"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-lg mb-2">{selectedLocation.title}</h3>
            <p className="text-gray-600">{selectedLocation.description}</p>
          </div>
        )}
      </div>

      {/* Map Legend moved below the image */}
      <MapKey />
    </div>
  );
}
