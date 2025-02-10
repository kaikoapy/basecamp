import { Card } from "@/components/ui/card";
import { XIcon, CheckIcon, InfoIcon } from "lucide-react"; // Added InfoIcon

interface Misconception {
  id: string;
  myth: string;
  reality: string;
  explanation: string;
  origin: string;
}

interface MisconceptionsSectionProps {
  title: string;
  description: string;
  misconceptions: Misconception[];
}

export function MisconceptionsSection({
  title,
  description,
  misconceptions,
}: MisconceptionsSectionProps) {
  return (
    <div className="py-24 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {misconceptions.map((item) => (
            <Card key={item.id} className="p-6">
              {/* Myth Section */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <XIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.myth}</h3>
                </div>
              </div>

              {/* Reality Section */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.reality}</p>
                  <p className="mt-2 text-gray-600">{item.explanation}</p>
                </div>
              </div>

              {/* Origin Section */}
              <div className="flex items-start gap-4 pt-4 border-t">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <InfoIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{item.origin}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
