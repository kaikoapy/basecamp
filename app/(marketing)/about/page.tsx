import { Metadata } from "next";
import Image from "next/image";
import { CtaSection } from "../_components/cta-section";
import { Badge } from "@/components/ui/badge";
import { Faqs } from "../_components/Faqs";

export const metadata: Metadata = {
  title: "Resources | Basecamp",
  description: "Essential resources and guides for Volvo dealerships using Basecamp.",
};

export default function AboutPage() {
  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-24 md:pb-32">
        {/* Hero Section - OpenAI style with large, centered text */}
        <section className="mb-24 md:mb-32 text-center">
          <Badge variant="secondary" className="mb-6">Company</Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-8">
            About Basecamp
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
          The goal here isn&apos;t just better technology, —it&apos;s about completely rethinking how a company can serve the industry with better operations, culture, and execution. Then actually doing it.
          </p>
        </section>

        {/* Mission Section - Large text, minimal styling */}
        <section className="mb-24 md:mb-32 max-w-3xl mx-auto">
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-12">
            <Image
              src="/images/working.webp"
              alt="Modern workplace environment"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-2xl md:text-3xl font-light leading-relaxed text-neutral-800">
            Here&apos;s the deal with Basecamp: Right now, we&apos;re all-in with Volvo dealerships—and only Volvo
            dealerships. Our priority is to thoroughly understand one manufacturer&apos;s needs, delivering
            something hyperfocused and truly exceptional, and not a generic one-size-fits-none approach.
          </p>
        </section>

        {/* Values Section - Clean grid layout */}
        <section className="mb-24 md:mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Dealership Software is Broken</h2>
              <p className="text-neutral-600 leading-relaxed">
                The automotive software landscape is stuck in the past. It is ridiculously slow with onboarding, seemingly
                allergic to improvement, and characterized by gatekeeping and bare-minimum quality—all with shark-like
                prices. We&apos;re here to change that and set a new standard.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Our Approach</h2>
              <p className="text-neutral-600 leading-relaxed">
                We&apos;re here to fundamentally shift how software is developed, delivered, and supported. We believe in manufacture focused software that is simple but powerful, immediately easy to use, and noticeably better every month through constant improvements.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">What&apos;s next?</h2>
              <p className="text-neutral-600 leading-relaxed">
                We&apos;re committed to continuously adding features and improving our offering so that dealerships operate more efficiently and profitably. Once we&apos;ve perfected our offering with Volvo, we&apos;ll be ready to expand to new manufacturers, ensuring that every dealership can benefit from our ultimate solution.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <Faqs />

        {/* CTA Section */}
        <div className="mt-24 md:mt-32">
          <CtaSection />
        </div>
      </div>
    </div>
  );
}
