"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface BrochureCardProps {
  model: string;
  year: string;
  imageUrl: string;
  pdfUrl: string;
  description: string;
}

export function BrochureCard({
  model,
  year,
  imageUrl,
  pdfUrl,
  description,
}: BrochureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative h-[400px] cursor-pointer"
      onClick={() => window.open(pdfUrl, "_blank")}
    >
      <div className="absolute inset-0 bg-white rounded-lg overflow-hidden transform-gpu transition-all duration-300 ease-in-out hover:rotate-1">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 bg-[url('/textures/paper.png')] opacity-50 mix-blend-overlay" />

        {/* Content */}
        <div className="relative h-full flex flex-col">
          {/* Image section */}
          <div className="relative h-2/3 overflow-hidden">
            <Image
              src={imageUrl}
              alt={`${year} ${model}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Text section */}
          <div className="p-6 flex-1 bg-gradient-to-b from-white to-gray-50">
            <h3 className="text-2xl font-bold mb-1">
              {year} {model}
            </h3>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {/* Page curl effect */}
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-t from-gray-200 to-white transform rotate-45 translate-x-6 translate-y-6 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-300" />
        </div>

        {/* Shadows */}
        <div className="absolute inset-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300" />
      </div>
    </motion.div>
  );
}
