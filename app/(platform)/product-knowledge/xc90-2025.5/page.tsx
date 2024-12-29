import { Separator } from "@/components/ui/separator";
import { ProductSection } from "@/components/product-knowledge/product-section";
import { PowertrainTable } from "@/components/product-knowledge/powertrain-table";
import Image from "next/image";

export const metadata = {
  title: "XC90 2025.5 | Product Knowledge",
  description: "Product knowledge details for the 2025.5 Volvo XC90",
};

export default function XC902025Page() {
  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">XC90 2025.5</h1>
          <p className="text-muted-foreground">
            Key updates and improvements for the refreshed XC90
          </p>
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
            ]}
          />
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="/images/product-knowledge/xc90-2025/exterior.jpg"
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
              src="/images/product-knowledge/xc90-2025/interior.jpg"
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
              "Top-of-the-range Bowers & Wilkins audio system",
              "Comprehensive suite of driver assistance features",
            ]}
          />
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="/images/product-knowledge/xc90-2025/technology.jpg"
              alt="XC90 2025.5 Technology Features"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <ProductSection
          title="Performance and Handling"
          items={[
            "Revised suspension with frequency selective dampers",
            "Available air suspension system analyzing road 500 times per second",
            "Retained powertrain options including mild hybrid and plug-in hybrid versions",
          ]}
        />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Powertrain Options</h2>
          <PowertrainTable
            powertrains={[
              {
                name: "B5",
                specs: "2.0L turbocharged 4-cylinder",
                power: "247 hp",
                torque: "266 lb-ft",
              },
              {
                name: "B6",
                specs: "2.0L supercharged and turbocharged 4-cylinder",
                power: "295 hp",
                torque: "310 lb-ft",
              },
              {
                name: "T8 Plug-in Hybrid",
                specs: "2.0L super/turbocharged 4-cylinder + electric motor",
                power: "455 hp",
                torque: "523 lb-ft",
                additional: "18.8 kWh battery",
              },
            ]}
          />
          <p className="text-sm text-muted-foreground">
            All variants feature an 8-speed automatic transmission and all-wheel
            drive as standard.
          </p>
        </div>
      </div>
    </div>
  );
}
