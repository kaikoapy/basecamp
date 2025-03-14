import { Separator } from "@/components/ui/separator";
import { ProductSection } from "@/app/(platform)/product-knowledge/(components)/product-section";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const PDF_URL = "https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1yf58lO8km2lsDhR6Wy3n7SLz5pJYofGPNwd1M";

export const metadata = {
  title: "MY26 Changes | Product Knowledge",
  description: "Key updates and changes for MY26 Volvo lineup",
};

export default function MY26ChangesPage() {
  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">MY26 Changes</h1>
            <p className="text-muted-foreground">
              Key updates and improvements for the 2026 model year
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              download="MY26-Product-Guide.pdf"
            >
              <Download className="w-4 h-4" />
              Download Full Guide
            </a>
          </Button>
        </div>

        <Separator />

        {/* Platform Updates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ProductSection
            title="Platform Updates"
            items={[
              "Volvo Car UX introduction with 11.2\" center display",
              "Black editions exterior colors expanded to 4 colors: Onyx Black, Crystal White, Vapour Grey & Denim Blue",
              "Core & Plus: Added Adaptive Cruise Control (ACC) as standard",
              "Core: Added Park Assist camera with front and rear sensors as standard",
            ]}
          />
        </div>

        {/* CMA Platform Updates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ProductSection
            title="CMA Platform Updates"
            items={[
              "New exterior colors: Aurora Silver, Forest Lake & Denim Blue (all carlines)",
              "Black Edition now available on XC40, EX40 & EC40 (Ultra only)",
              "Black roof standard on XC40 Ultra Black Edition",
              "XC40 B4 FWD re-introduction (Core & Plus)",
              "XC40 available as dark theme only",
              "EX40 & EC40: Heat pump moved to single option",
            ]}
          />
        </div>

        {/* SPA1 Platform Updates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ProductSection
            title="SPA1 Platform Updates"
            items={[
              "New exterior colors: Aurora Silver (all carlines)",
              "Forest Lake (XC60 & V60CC)",
              "Mulberry (XC60 & S90)",
              "XC90: Dark added for Ultra only (6- and 7-seater)",
            ]}
          />
        </div>
      </div>

      {/* Available Order Guides Section */}
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Available MY26 Order Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "XC90",
            "XC60 with Polestar Engineered included",
            "XC40",
            "V60 Cross Country",
            "V90 Cross Country",
            "EX40 - version 2",
            "EC40",
            "EX30",
          ].map((model) => (
            <div
              key={model}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              {model}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Information about EX90, S90, EX30 and EX30 Cross Country will be released at a later date.
        </p>
      </div>
    </div>
  );
}
