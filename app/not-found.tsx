import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      {/* Fun 404 illustration */}
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="/404.svg"
          alt="404 Illustration"
          fill
          className="object-contain"
          priority
        />
      </div>

      <h1 className="text-4xl font-bold mb-2">Oops! Wrong Turn</h1>

      <p className="text-xl text-muted-foreground mb-8">
        Looks like this page took a coffee break! ☕️
      </p>

      <div className="space-y-4">
        <p className="text-muted-foreground">
          Don&apos;t worry, even the best GPS sometimes leads us astray.
        </p>

        <Button asChild size="lg">
          <Link href="/">Take Me Home 🏠</Link>
        </Button>
      </div>

      {/* Fun facts about 404 */}
      <div className="mt-12 p-4 bg-muted/50 rounded-lg max-w-md">
        <h2 className="font-semibold mb-2">Did you know? 🤔</h2>
        <p className="text-sm text-muted-foreground">
          The 404 error code came about when CERN workers had to track down
          errors in their network. Room 404 was their central database, but when
          the database couldn&apos;t find something, they&apos;d just say it was
          &quot;room 404 – not found&quot;!
        </p>
      </div>
    </div>
  );
}
