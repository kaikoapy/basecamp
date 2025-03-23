import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { CtaSection } from "../_components/cta-section";

export const metadata: Metadata = {
  title: "Resources | Basecamp",
  description: "Essential resources and guides for Volvo dealerships using Basecamp.",
};

export default function ResourcesPage() {
  return (
    <div className="relative">
      <div className="absolute -z-10 top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_0%_0%,rgba(106,104,241,0.05)_0,rgba(106,104,241,0)_50%),radial-gradient(circle_at_100%_0%,rgba(106,104,241,0.05)_0,rgba(106,104,241,0)_50%)]"></div>
      
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-32">
            Hey, Dealerships—Meet Basecamp
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Running a dealership is tough enough—hustling customers, juggling inventory, keeping the team sharp—without software making it harder.
          </p>
        </section>

        {/* Main Content */}
        <section className="space-y-12">
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed">
                Here&apos;s the deal with Basecamp: Right now, we&apos;re all-in with Volvo dealerships—and only Volvo dealerships. Why? Because we&apos;re not about slapping together some generic, one-size-fits-none software and chasing quick profits from every manufacturer under the sun. We&apos;d rather nail it for Volvo teams first—digging deep into what you need, delivering something hyperfocused and top-notch, not a watered-down &quot;good enough&quot; for everyone. Once we&apos;ve got it dialed in, we&apos;ll expand to other brands, but for now, it&apos;s all about quality over cash-grab. You deserve software that&apos;s built for you, not just another paycheck for us.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">What ticks us off (and why we&apos;re here):</h2>
              <p className="text-lg leading-relaxed">
                The usual automotive software scene? It&apos;s a mess—week-long onboarding that wastes your time, hidden fees that nickel-and-dime you, and updates so rare you&apos;re stuck with a relic while the world moves on. That grinds our gears. We&apos;re here to flip that—fast setup, fair pricing, and a platform that keeps getting better because we&apos;re relentless about tweaking it with the latest tech. Volvo dealerships shouldn&apos;t settle for less.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">How we roll:</h2>
              <p className="text-lg leading-relaxed">
                We keep it simple and real. No flashy sales pitches or locked-in contracts—if it&apos;s not working for you, tell us why and we&apos;ll fix it or let you walk, no hard feelings. Our support&apos;s quick and human (no robots here), and we&apos;re obsessed with making Basecamp something you&apos;ll actually enjoy using. It&apos;s about cutting the chaos so you can focus on what you do best: selling Volvos.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">What&apos;s next?</h2>
              <p className="text-lg leading-relaxed">
                We&apos;re starting with Volvo because we want to get it right—really right—before branching out. Every tweak, every update, every chat with you helps us sharpen Basecamp into the tool your dealership deserves. Down the road, we&apos;ll bring this to other manufacturers, but only when we&apos;re sure it&apos;s as good for them as it is for you. Stick with us, and let&apos;s make dealership life smoother together.
              </p>
            </div>
          </div>

          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed">
                So, if you&apos;re tired of the same old software runaround, give Basecamp a shot. We&apos;re here to make dealership life smoother, smarter, and way less stressful.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Basecamp FAQ: The Stuff You&apos;re Probably Wondering About</h2>
            <p className="text-lg text-muted-foreground">
              We know dealerships have been burned by software companies before—us too, honestly. So here&apos;s the straight scoop on Basecamp, who we are, and why we&apos;re not like the usual suspects.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="trust">
              <AccordionTrigger>Why should we trust you guys? Aren&apos;t you just another software company?</AccordionTrigger>
              <AccordionContent>
                Fair question. We&apos;re not here to dazzle you with empty hype and then vanish when the check clears. We&apos;re a team that&apos;s seen the dealership grind up close—frustrated by overpriced, outdated tools—and decided to do something about it. We&apos;re in this to help, not to hustle you. No overpromising, just delivering.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pricing">
              <AccordionTrigger>What&apos;s the catch with your pricing? Is it really affordable?</AccordionTrigger>
              <AccordionContent>
                No catch, promise. We hate nickel-and-diming as much as you do—no sneaky fees or &quot;oh, you want that feature? Pay extra&quot; nonsense. Our pricing&apos;s upfront and fair, built to fit dealership budgets, not drain them. We want you thriving, not stressing over invoices.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="setup">
              <AccordionTrigger>How fast can we actually get started? Week-long setup sessions sound awful.</AccordionTrigger>
              <AccordionContent>
                They are awful, and we don&apos;t do them. Basecamp&apos;s designed to get you rolling quick—no week-long onboarding marathons or endless tutorials. Think hours, not days. We keep it simple so your team can focus on selling, not setup.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="support">
              <AccordionTrigger>What&apos;s your deal with support? Will we be stuck on hold forever?</AccordionTrigger>
              <AccordionContent>
                Nope, no call-center purgatory here. Our support&apos;s real people who get it—fast, friendly, and actually helpful. We&apos;re not perfect, but we&apos;ll bust our tails to fix what&apos;s wrong. You&apos;re not just a ticket number to us.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="updates">
              <AccordionTrigger>Do you ever update this thing, or are we stuck with version 1.0 forever?</AccordionTrigger>
              <AccordionContent>
                Oh, we&apos;re relentless about updates. Basecamp&apos;s built on modern tech, and we&apos;re constantly tweaking, improving, and adding stuff—without making you wait years or pay more for it. We evolve so you don&apos;t get left behind.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="different">
              <AccordionTrigger>Why do you keep saying you&apos;re different? Prove it.</AccordionTrigger>
              <AccordionContent>
                We&apos;re not fans of the typical software playbook—overcharge, underdeliver, treat you like a cog. We&apos;re more like your dealership&apos;s co-pilot: affordable, approachable, and obsessed with making your life easier. Our proof? Stick with us, and you&apos;ll feel the difference—no fluff, just results.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="goal">
              <AccordionTrigger>Are you just in it for the money, or what&apos;s your real goal?</AccordionTrigger>
              <AccordionContent>
                Money&apos;s nice (gotta eat!), but we&apos;re here because we genuinely think dealerships deserve better than clunky, overpriced tech. Our goal&apos;s to cut the chaos, save you time, and maybe even make your day a little brighter. We&apos;re small enough to care, big enough to deliver.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="bail">
              <AccordionTrigger>What if we hate it? Can we bail?</AccordionTrigger>
              <AccordionContent>
                We&apos;d be bummed, but yeah, you&apos;re not locked in. We don&apos;t trap you with shady contracts or guilt trips. If Basecamp&apos;s not your vibe, you&apos;re free to roll—we just hope you&apos;ll tell us why so we can keep getting better.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="team">
              <AccordionTrigger>Who&apos;s behind Basecamp anyway?</AccordionTrigger>
              <AccordionContent>
                A bunch of folks who&apos;ve been around cars and tech long enough to spot the gaps. We&apos;re not some faceless corporation—just a team tired of seeing dealerships struggle with bad software. We&apos;re building what we wish we&apos;d had back in the day.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="start">
              <AccordionTrigger>How do we get started?</AccordionTrigger>
              <AccordionContent>
                Easy—reach out, and we&apos;ll walk you through it (no pressure, no sales-y spiel). We&apos;re here when you&apos;re ready to ditch the old ways and try something that actually works for you.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA Section */}
        <CtaSection />
      </div>
    </div>
  );
}
