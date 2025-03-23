"use client";

import React from "react";

interface FormattedDescriptionProps {
  text: string | (string | React.ReactNode)[];
}

export function FormattedDescription({ text }: FormattedDescriptionProps) {
  return (
    <p className="text-muted-foreground text-lg">
      {text}
    </p>
  );
} 