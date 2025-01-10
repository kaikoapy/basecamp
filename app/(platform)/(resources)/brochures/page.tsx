import { Separator } from "@/components/ui/separator";
import { ProductBooklets } from "./components/product-booklets";

export const metadata = {
  title: "Volvo Brochures | Dealer Hub",
  description: "Digital brochures for all Volvo models",
};

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

        <div className="max-w-7xl mx-auto space-y-6">
          <ProductBooklets />
        </div>
      </div>
    </div>
  );
}
