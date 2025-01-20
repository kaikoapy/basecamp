import { Separator } from "@/components/ui/separator";
import { ProductSection } from "@/app/(platform)/product-knowledge/(components)/product-section";
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
              "New front bumper, sculpted hood, fenders, and grille design with iron mark",
              "New slim signature headlights with Matrix-design LED technology",
              'New wheels available in 20", 21" and 22" sizes',
              "Improved comfort chassis with Frequency Selective Damping technology",
              "New exterior color: Mulberry Red",
              "Visually upgraded rear lamps with darkened design",
              "Removed Platinum Grey",
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
              "New upholstery options: Nordico, Navy Herringbone, and Cardamom Ventilated Nappa Leather",
              "New second row seat armrests with integrated cupholders (6-passenger variant)",
              "6 Seat configurability with B5 engines",
              "Improved sound insulation for a quieter ride",
              "Updated steering wheel with new iron mark",
              "Upgraded tailored instrument panel",
              'Larger center screen (increased from 9" to 11.2")',
              "New tailored tunnel console with improved wireless phone charger and 2+1 cupholder",
              "Enhanced high spec interior illumination",
              "New interior decors: Light Ash, Grey Ash, and Brown Ash",
              "Removed Maroon interior options",
              "Removed Amber interior",
              "Removed Slate interior",
              "6 passenger configurability with B5 engines",
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
      </div>

      {/* Trim Differences Section */}
      <div className="space-y-4 mt-6">
        <TrimDifferences />
      </div>
    </div>
  );
}
