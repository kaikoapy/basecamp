import React from "react";

export default function Features() {
  return (
    <section
      aria-labelledby="features-title"
      className="mx-auto mt-24 w-full max-w-6xl px-3"
    >
      <div className="space-y-12 w-full py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-col items-center space-y-2 max-w-3xl">
            <div className="rounded-lg bg-foreground text-background px-4 py-1.5 text-sm">
              Founder Letter
            </div>
          </div>
          
          {/* Letter Container */}
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl p-8 md:p-12 border border-gray-200">
            {/* Paper texture effect using CSS patterns */}
            <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:100%_1.5rem] opacity-10" />
            </div>
            
            {/* Letter content */}
            <div className="relative space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
                Simplifying Dealership Life
              </h2>
              <div className="space-y-6 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <p className="mb-4">
                  Hey everyone... Let&apos;s talk about the chaos of the modern dealership.
                </p>
                <p className="mb-4">
                  Remember when selling cars meant focusing on customers, not hunting through endless tabs and bookmarks? I couldn&apos;t. My bookmark bar ran out of space years ago.
                </p>
                <p className="mb-4">
                  Every day, I watched talented sales professionals waste time searching through countless systems just to answer basic questions—the same questions asked yesterday, with answers buried somewhere in our digital sprawl. Training new hires meant overwhelming them with dozens of separate tools instead of helping them connect with customers.
                </p>
                <p className="mb-4">
                  This isn&apos;t just inefficient. It&apos;s broken.
                </p>
                <p className="mb-4">
                  Basecamp was born from this frustration. Not as another tool to add to your collection—but as the solution that brings everything together. One place where every resource lives. No more digital treasure hunts. No more &quot;where do I find that again?&quot;
                </p>
                <p className="mb-4">
                  This is about giving you back the time to do what you do best: connecting with customers and selling Volvos.
                </p>
                <p className="mb-4">
                  Welcome to Basecamp. Everything your sales team needs in one place.
                </p>
                <p className="mb-4">
                  Because there had to be a better way.
                </p>
                <p className="mb-4">
                  Now there is.
                </p>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-12 flex flex-col items-start border-t border-gray-200 pt-6">
              <p className="font-medium">Kai Koa</p>
              <p className="text-sm text-muted-foreground">Founder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}