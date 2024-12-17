"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommandSearch } from "@/components/sidebar/command-search";
import { cn } from "@/lib/utils";

export function SearchWidgetCard() {
  return (
    <Card
      className={cn(
        "col-span-3 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-800/40",
        "dark:from-slate-950 dark:to-slate-900 dark:border-slate-800/40"
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-slate-200">
          Quick Search
        </CardTitle>
      </CardHeader>
      <CardContent className="search-widget-dark">
        <CommandSearch />
      </CardContent>
    </Card>
  );
}
