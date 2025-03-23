"use client";

import { Button } from "@/components/ui/button";
import { RiPlayCircleFill } from "@remixicon/react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="px-4 py-12 md:py-16 lg:py-20 relative overflow-hidden">
      <div className="container flex flex-col items-center text-center mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Our <span className="gradient-text">awesome</span> features in <span className="italic">one</span> place
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
  A stacked lineup of features—<strong>Dashboard</strong>, <strong>Resources</strong>, <strong>Training</strong>, and more—built to <strong>simplify</strong> your dealership&apos;s chaos, save hours, and turn your team into sales rockstars.
</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/docs" className="flex items-center gap-2">
                <RiPlayCircleFill
                  aria-hidden="true"
                  className="size-5 shrink-0"
                />
                Watch Demo
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 md:mt-20 w-full"
        >
        </motion.div>
      </div>
    </section>
  );
}
