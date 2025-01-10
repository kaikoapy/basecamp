import { Separator } from "@/components/ui/separator";
import { ProductSection } from "@/components/product-knowledge/product-section";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import TrimDifferences from "./(components)/TrimCard";

const PDF_URL =
  "https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yf58lO8km2lsDhR6Wy3n7SLz5pJYofGPNwd1M";

export const metadata = {
  title: "XC90 2025.5 | Product Knowledge",
  description: "Product knowledge details for the 2025.5 Volvo XC90",
};

export default function XC902025Page() {
  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">XC90 2025.5</h1>
            <p className="text-muted-foreground">
              Key updates and improvements for the refreshed XC90
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              download="XC90-2025.5-Product-Guide.pdf"
            >
              <Download className="w-4 h-4" />
              Download Full Guide
            </a>
          </Button>
        </div>

        <Separator />

        {/* Exterior Section with Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ProductSection
            title="Exterior Changes"
            items={[
              "Slimmer 'Thor's Hammer' headlights with Matrix design technology",
              "Redesigned front grille and air intake",
              "Sculpted hood for a more striking appearance",
              "Updated front bumper and fender designs",
              "New wheel designs ranging from 20 to 22 inches",
              "Darkened taillamps",
              "New Mulberry Red color option",
              "No Platinum Grey color option",
            ]}
          />
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yhgDaVmWuJpeyjWPSn2v3rc0zk71VadbIi4CG"
              alt="XC90 2025.5 Exterior"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Interior Section with Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ProductSection
            title="Interior Enhancements"
            items={[
              "Improved sound insulation, including acoustic foam-filled pillars",
              "Finer interior materials for a more upscale feel",
              "New 11.2-inch center touchscreen with updated interface from EX90",
              "Redesigned dashboard",
            ]}
          />
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yb11SReXY7a9wYoCTzdmeAphWyXuG0RsMUniq"
              alt="XC90 2025.5 Interior"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Technology Section with Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ProductSection
            title="Technology and Safety"
            items={[
              "Updated infotainment system",
              "New 11.2-inch center touchscreen with updated interface from EX90",
              "Wireless phone charger",
            ]}
          />
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1y3XWlIvVG1iExufVLq5DMdWB7r4KkzpFSwmP3"
              alt="XC90 2025.5 Technology Features"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Trim Differences Section */}
        <div className="space-y-4">
          <TrimDifferences />
        </div>
      </div>
    </div>
  );
}
