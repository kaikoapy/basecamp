import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export default function ProductInfoPage() {
  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Core Product Line</h1>
          <p className="text-muted-foreground">
            Understanding Volvo&apos;s SUV lineup - Your essential sales
            foundation
          </p>
        </div>

        <Separator />

        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed">
            As a Volvo salesperson, the XC40, XC60, and XC90 form the backbone
            of your sales portfolio. These three SUVs cater to different
            customer needs while maintaining Volvo&apos;s core values of safety,
            luxury, and Scandinavian design.
          </p>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Feature</TableHead>
                <TableHead>XC40</TableHead>
                <TableHead>XC60</TableHead>
                <TableHead>XC90</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Size</TableCell>
                <TableCell>Compact</TableCell>
                <TableCell>Midsize</TableCell>
                <TableCell>Full-size</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Seating</TableCell>
                <TableCell>5</TableCell>
                <TableCell>5</TableCell>
                <TableCell>6 or 7</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Base Engine</TableCell>
                <TableCell>247 hp</TableCell>
                <TableCell>247 hp</TableCell>
                <TableCell>295 hp</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Top Engine</TableCell>
                <TableCell>247 hp</TableCell>
                <TableCell>455 hp (PHEV)</TableCell>
                <TableCell>455 hp (PHEV)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Max Cargo</TableCell>
                <TableCell>63.3 cu ft</TableCell>
                <TableCell>63.3 cu ft</TableCell>
                <TableCell>85.7 cu ft</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Starting MSRP</TableCell>
                <TableCell>$46,450</TableCell>
                <TableCell>$56,000</TableCell>
                <TableCell>$65,100</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">XC40: Entry Luxury</h3>
            <p className="text-muted-foreground">
              Perfect for young professionals and urban dwellers seeking a
              premium compact SUV. Emphasize its city-friendly size, modern
              tech, and value proposition.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">XC60: Popular Choice</h3>
            <p className="text-muted-foreground">
              The sweet spot for many buyers. Highlight its balance of luxury,
              performance (especially the PHEV), and versatility. Great for
              families and luxury buyers alike.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">XC90: Flagship SUV</h3>
            <p className="text-muted-foreground">
              The ultimate expression of Volvo luxury. Focus on its 6/7-seat
              flexibility, premium features, and status as the flagship SUV.
              Perfect for larger families and luxury buyers.
            </p>
          </div>
        </div>

        <Card className="p-6 bg-muted">
          <h3 className="text-xl font-semibold mb-4">Sales Tips</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              • Always start by understanding the customer&apos;s needs - family
              size, usage patterns, and budget
            </li>
            <li>
              • Highlight Volvo&apos;s core strengths: safety, Scandinavian
              design, and sustainable luxury
            </li>
            <li>
              • Know the key differentiators between models to guide customers
              to the right choice
            </li>
            <li>
              • Remember that the PHEV versions offer both performance and
              efficiency benefits
            </li>
            <li>
              • Focus on the value proposition and features that matter most to
              each customer
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
