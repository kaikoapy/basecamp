import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CtaSectionProps {
  title?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export function CtaSection({
  title = "Ready to give Basecamp a try?",
  primaryButtonText = "Request Access",
  primaryButtonHref = "#",
  secondaryButtonText = "Contact Us",
  secondaryButtonHref = "#",
}: CtaSectionProps) {
  return (
    <section className="text-center space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex justify-center gap-4">
        <Button asChild size="lg">
          <Link href={primaryButtonHref}>{primaryButtonText}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
        </Button>
      </div>
    </section>
  );
} 