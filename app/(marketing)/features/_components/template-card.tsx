import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ReactNode } from "react";
import { FormattedDescription } from "../../about/_components/formatted-description";
import React from "react";

interface Technology {
  name: string;
  icon: ReactNode;
}

interface TemplateCardProps {
  title: string;
  description: string | (string | React.ReactNode)[];
  technologies?: Technology[];
  className?: string;
}

export function TemplateCard({
  title,
  description,
  technologies,
  className,
}: TemplateCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className={cn("p-6 space-y-6 lg:col-span-5", className)}>
        <div className="space-y-2">
          <p className="text-[#6a68f1] text-sm font-semibold">
            Included
          </p>
          <h3 className="font-heading text-3xl font-bold">{title}</h3>
          <FormattedDescription text={description} />
        </div>

        {technologies && (
          <div className="flex items-center gap-2">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"
                title={tech.name}
              >
                {tech.icon}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative h-full min-h-[400px] lg:col-span-7 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.1)] bg-gradient-to-br from-background to-muted">
        <Image
          src={`/templates/${title.toLowerCase().replace(/\s+/g, '-')}.png`}
          alt={`${title} Preview`}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
} 