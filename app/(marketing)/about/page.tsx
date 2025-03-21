import { Badge } from "../_components/Badge";
import { Button } from "../_components/Button";
import Benefits from "../_components/Benefits";
import TeamGallery from "../_components/TeamGallery";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";

export default function About() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section
        aria-labelledby="about-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>About Basecamp</Badge>
        <h1
          id="about-overview"
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        >
          <Balancer>
            Something’s broken in dealership software
          </Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          Your bookmarks bar is a mess. Links to Carfax, inventory, schedules—scattered everywhere. <br />
          Basecamp cuts through the chaos for Volvo sales teams.
        </p>
      </section>
      <TeamGallery />
      <Benefits />
      <section aria-labelledby="vision-title" className="mx-auto mt-40">
        <h2
          id="vision-title"
          className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-gray-50 dark:to-gray-300"
        >
          Our Vision
        </h2>
        <div className="mt-6 max-w-prose space-y-4 text-gray-600 dark:text-gray-400">
        <p className="text-lg leading-8">
  Remember when selling cars was straightforward? You had your tools, your team, your rhythm. Now, it’s a mess—bookmarks overflowing with Carfax, inventory sites, and Volvo portals, schedules buried in emails, product specs lost in PDFs. Your sales team’s drowning in tabs and links, not deals.
</p>
<p className="text-lg leading-8">
  Dealerships run on a dozen disconnected resources. Every day, your crew hunts for the right link—CRM here, inventory there, store directory somewhere else. It’s chaos, not control. Time bleeds away chasing tools instead of customers. You deserve better than this scramble.
</p>
<p className="text-lg leading-8">
  We built Basecamp to end that madness. One hub, every link—Carfax, inventory, schedules, store directories, Volvo know-how—all right there. No more tab roulette or bookmark graveyard. It’s lean, it’s fast, it’s built by someone who’s lived sales, not just coded it.
</p>
<p className="text-lg leading-8">
  Our vision? A Volvo sales team unshackled from resource chaos. No more digging, just selling. We’ve been solving team problems for decades—now we’re here to streamline your dealership’s hustle. The era of focus starts with Basecamp.
</p>
          <p
            className={cn(
              "font-handwriting w-fit rotate-3 text-3xl text-indigo-600 dark:text-indigo-400",
            )}
          >
            – Kai
          </p>
        </div>
        <Button className="mt-32 h-10 w-full shadow-xl shadow-indigo-500/20">
          Join Our Crew
        </Button>
      </section>
    </div>
  );
}