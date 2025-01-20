import { Separator } from "@/components/ui/separator";
import { ProductSection } from "@/app/(platform)/product-knowledge/(components)/product-section";
import Image from "next/image";

export const metadata = {
  title: "EX30 | Product Knowledge",
  description: "Product knowledge details for the Volvo EX30",
};

export default function EX30Page() {
  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Volvo EX30</h1>
          <p className="text-muted-foreground">
            The Future of Compact Electric SUVs
          </p>
        </div>

        <Separator />

        <p className="text-lg leading-relaxed">
          The Volvo EX30 represents a bold step into the future of electric
          mobility, offering the perfect blend of Scandinavian design,
          cutting-edge technology, and Volvo&apos;s renowned safety features in
          a compact, eco-friendly package. As the smallest model in Volvo&apos;s
          lineup, it brings luxury electric vehicles to a more accessible price
          point without compromising on performance or features.
        </p>

        {/* Performance Section with Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <ProductSection
              title="Performance and Range"
              items={[
                "Single Motor Extended Range (RWD): 268 hp, 253 lb-ft",
                "Twin Motor Performance (AWD): 422 hp, 400 lb-ft",
                "0-60 mph in 3.4 seconds (Twin Motor)",
                "275 miles maximum driving range",
                "DC Fast-Charging: 10% to 80% in 26.5 minutes",
              ]}
            />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold">Starting Price:</p>
              <ul className="list-disc list-inside">
                <li>Single Motor: $36,245</li>
                <li>Twin Motor: $46,195</li>
              </ul>
            </div>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yzvCzV9O0hjmS4fOLN1qgvdriDbFCVGYJwQlX"
              alt="EX30 Performance"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Design Section with Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ProductSection
            title="Design and Dimensions"
            items={[
              "Signature Thor's Hammer headlights",
              "Sleek, coupe-like roofline for sporty stance",
              "Wheel options ranging from 19 to 22 inches",
              "Height: 61 inches",
              "Length: 166.7 inches",
              "Width: 72 inches",
              "20.7 cm shorter and 9.8 cm lower than XC40 Recharge",
            ]}
          />
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yoNNmSqwPkMteXwEh56n8B9TDmpOWubxqyJ7C"
              alt="EX30 Exterior Design"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Interior Section with Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ProductSection
            title="Interior Features"
            items={[
              "Minimalist Scandinavian-inspired design",
              "Premium audio system featuring a stylish soundbar",
              "Spacious cabin despite compact exterior dimensions",
              "Dashboard composed of recycled window frames",
              "Sustainably harvested textiles including Merino wool",
            ]}
          />
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yObR4lDpvrsXpeiu26yZTBnadAzhLNKxb95WI"
              alt="EX30 Interior"
              fill
              className="object-cover"
            />
          </div>
        </div>
        {/* Technology Section with Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <ProductSection
              title="Technology"
              items={[
                "12.3-inch center touchscreen",
                "Google-powered infotainment system",
                "Customizable driver interface",
                "Advanced connectivity features",
              ]}
            />
            <ProductSection
              title="Safety and Driver Assistance"
              items={[
                "Park Pilot Assist with automated parallel parking",
                "360° camera system",
                "Door opening alert system for cyclist protection",
                "Latest generation of driver assistance technologies",
              ]}
            />
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yVklUijSuK4t9LmXyGPHapJfoWbeqcrSTOv26"
              alt="EX30 Technology Features"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <ProductSection
          title="Environmental Impact"
          items={[
            "The smallest carbon footprint of any Volvo car to date",
            "Extensive use of renewable and recycled materials",
            "Zero-emission electric drivetrain",
            "Thoughtful material selection throughout the vehicle",
          ]}
        />
      </div>
    </div>
  );
}
