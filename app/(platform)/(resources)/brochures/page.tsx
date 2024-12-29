import { Separator } from "@/components/ui/separator";
import { BrochureCard } from "@/components/brochures/brochure-card";

export const metadata = {
  title: "Volvo Brochures | Dealer Hub",
  description: "Digital brochures for all Volvo models",
};

const brochures = [
  {
    model: "XC90",
    year: "2025",
    imageUrl: "/images/brochures/xc90.jpg",
    pdfUrl: "/brochures/2025-xc90.pdf",
    description: "Luxury 7-seat SUV",
  },
  {
    model: "XC60",
    year: "2024",
    imageUrl: "/images/brochures/xc60.jpg",
    pdfUrl: "/brochures/2024-xc60.pdf",
    description: "Mid-size Luxury SUV",
  },
  {
    model: "XC40",
    year: "2024",
    imageUrl: "/images/brochures/xc40.jpg",
    pdfUrl: "/brochures/2024-xc40.pdf",
    description: "Compact Luxury SUV",
  },
  {
    model: "S60",
    year: "2024",
    imageUrl: "/images/brochures/s60.jpg",
    pdfUrl: "/brochures/2024-s60.pdf",
    description: "Sports Sedan",
  },
  {
    model: "V60",
    year: "2024",
    imageUrl: "/images/brochures/v60.jpg",
    pdfUrl: "/brochures/2024-v60.pdf",
    description: "Luxury Wagon",
  },
  {
    model: "EX90",
    year: "2024",
    imageUrl: "/images/brochures/ex90.jpg",
    pdfUrl: "/brochures/2024-ex90.pdf",
    description: "All-Electric Luxury SUV",
  },
  {
    model: "EX30",
    year: "2024",
    imageUrl: "/images/brochures/ex30.jpg",
    pdfUrl: "/brochures/2024-ex30.pdf",
    description: "Compact Electric SUV",
  },
];

export default function BrochuresPage() {
  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Digital Brochures</h1>
          <p className="text-muted-foreground">
            Access detailed product information for all Volvo models
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brochures.map((brochure) => (
            <BrochureCard
              key={`${brochure.model}-${brochure.year}`}
              {...brochure}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
