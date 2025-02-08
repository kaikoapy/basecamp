import LeaseDisclosureCard from "./LeaseDisclosureCard";
import type { Doc } from "@/convex/_generated/dataModel";

interface AdComparisonCardProps {
  ad: Doc<"leaseAds">;
}

export default function AdComparisonCard({ ad }: AdComparisonCardProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="w-full">
        <LeaseDisclosureCard disclosure={ad} />
      </div>
    </div>
  );
}

