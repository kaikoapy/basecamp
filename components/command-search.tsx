"use client";

import {
  ArrowUpRight,
  Search,
  Car,
  FileText,
  Receipt,
  CircleFadingPlus,
  FolderPlus,
  FileInput,
  CalendarDays,
  Mail,
  Phone,
} from "lucide-react";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface SearchAction {
  title: string;
  url: string;
  icon: React.ReactNode;
  shortcut?: string;
}

const searchActions: Record<string, (query: string) => SearchAction[]> = {
  vin: (query: string) => [
    {
      title: "Search Volvo Inventory",
      url: `https://www.volvocarsnorthmiami.com/inventory/search-results?vin=${query}`,
      icon: (
        <Car
          size={16}
          strokeWidth={2}
          className="opacity-60"
          aria-hidden="true"
        />
      ),
    },
    {
      title: "Get Carfax Report",
      url: `https://www.carfaxonline.com/vhrs/report?vin=${query}`,
      icon: (
        <FileText
          size={16}
          strokeWidth={2}
          className="opacity-60"
          aria-hidden="true"
        />
      ),
    },
    {
      title: "View Window Sticker",
      url: `https://www.windowsticker.com/sticker?vin=${query}`,
      icon: (
        <Receipt
          size={16}
          strokeWidth={2}
          className="opacity-60"
          aria-hidden="true"
        />
      ),
    },
  ],
  stock: (query: string) => [
    {
      title: "Search Stock Number",
      url: `https://www.volvocarsnorthmiami.com/inventory/search-results?stock=${query}`,
      icon: (
        <Car
          size={16}
          strokeWidth={2}
          className="opacity-60"
          aria-hidden="true"
        />
      ),
    },
  ],
};

export function CommandSearch() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [type, setType] = React.useState<"vin" | "stock" | null>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (value.length === 17) {
      setType("vin");
    } else if (value.length > 0) {
      setType("stock");
    } else {
      setType(null);
    }
  }, [value]);

  const handleSelect = (url: string) => {
    window.open(url, "_blank");
    setOpen(false);
  };

  return (
    <>
      <button
        className="inline-flex h-9 w-full rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 shadow-sm transition-colors hover:bg-slate-800 hover:border-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-700"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <Search
            className="-ms-1 me-3 text-slate-400"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="font-normal text-slate-400">
            Search by VIN or Stock #
          </span>
        </span>
        <kbd className="-me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border border-slate-700 bg-slate-800 px-1 font-[inherit] text-[0.625rem] font-medium text-slate-500">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          value={value}
          onValueChange={setValue}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {type && value && (
            <CommandGroup
              heading={type === "vin" ? "VIN Search" : "Stock Search"}
            >
              {searchActions[type](value).map((action) => (
                <CommandItem
                  key={action.title}
                  onSelect={() => handleSelect(action.url)}
                >
                  {action.icon}
                  <span className="ml-2">{action.title}</span>
                  <ArrowUpRight
                    className="ml-auto h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {!value && (
            <>
              <CommandGroup heading="Quick start">
                <CommandItem
                  onSelect={() =>
                    handleSelect("https://www.reliablepdf.com/checklist")
                  }
                >
                  <FolderPlus
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>New Deal Checklist</span>
                  <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={() => handleSelect("https://www.docuseal.com/")}
                >
                  <FileInput
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Import Documents</span>
                  <CommandShortcut>⌘I</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    handleSelect(
                      "https://www.volvocarsnorthmiami.com/inventory/new"
                    )
                  }
                >
                  <CircleFadingPlus
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Add New Vehicle</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Quick Links">
                <CommandItem
                  onSelect={() =>
                    handleSelect("https://calendar.google.com/calendar/")
                  }
                >
                  <CalendarDays
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Schedule Delivery</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => handleSelect("https://mail.google.com/mail/")}
                >
                  <Mail
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Open Email</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => handleSelect("https://app.goto.com/voice")}
                >
                  <Phone
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Voice Calls</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
