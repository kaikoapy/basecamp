"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, ArrowUpRight, User, Mail, Phone } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { useDialog } from "@/components/providers/dialog-provider";
import type { Doc } from "@/convex/_generated/dataModel";
import type { Resource } from "@/types/resources";

type DirectoryEntry = Doc<"directory">;

interface SearchResults {
  resources: Resource[];
  directory: DirectoryEntry[];
}

interface SearchBarProps {
  onOpenChange?: (open: boolean) => void;
}

// Add OS detection at the top
const isMacOS =
  typeof window !== "undefined" &&
  window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

export function SearchBar({ onOpenChange }: SearchBarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const { showDialog } = useDialog();

  const [previousResults, setPreviousResults] = React.useState<SearchResults>({
    resources: [],
    directory: [],
  });

  const setOpenState = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
      if (open) {
        inputRef.current?.focus();
      }
    },
    [onOpenChange]
  );

  // Query Convex
  const searchResults = useQuery(
    api.resources.search,
    search.length >= 2
      ? {
          query: search,
          limit: 5,
        }
      : "skip"
  );

  React.useEffect(() => {
    if (searchResults) {
      setPreviousResults(searchResults);
    }
  }, [searchResults]);

  // Only use previous results if we're still searching
  const displayResults =
    search.length >= 2
      ? searchResults || previousResults
      : { resources: [], directory: [] };

  // Handle clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setOpenState(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenState]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenState(true);
      }
      if (e.key === "Escape") {
        setOpenState(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpenState]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setOpenState(true);
  };

  const handleResourceClick = (resource: Resource) => {
    setOpenState(false);
    if (resource.isModal && resource.component) {
      // Convert component name to dialog name (e.g., "BusinessFAQDialog" -> "business-faq")
      const dialogName = resource.component
        .replace(/Dialog$/, "")
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "");
      showDialog(dialogName);
    } else if (resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  };

  const showDropdown =
    isOpen &&
    (search.length >= 3 ||
      displayResults.resources.length > 0 ||
      displayResults.directory.length > 0);

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setOpenState(true)}
          placeholder="Search resources and directory..."
          className="w-full h-10 px-4 py-2 pl-10 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-700/30"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          aria-hidden="true"
        />
        <kbd className="absolute hidden md:inline-flex right-3 top-1/2 transform -translate-y-1/2 pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">{isMacOS ? "⌘" : "Ctrl"}</span>K
        </kbd>
      </div>

      {/* Results Dropdown */}
      <div
        className={`absolute z-50 w-full mt-2 transform transition-all duration-200 ease-in-out ${
          showDropdown
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <div
          ref={resultsRef}
          className="bg-white rounded-md shadow-lg border overflow-hidden max-h-[80vh] overflow-y-auto"
        >
          <div className="py-2">
            {/* Resources Section */}
            {displayResults.resources.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Resources
                </div>
                {displayResults.resources.map((resource) => (
                  <button
                    key={resource._id}
                    onClick={() => handleResourceClick(resource)}
                    className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer group text-left"
                    type="button"
                  >
                    <span className="flex-grow">
                      <span className="font-medium">{resource.title}</span>
                      {resource.description && (
                        <span className="ml-2 text-gray-500 hidden md:inline">
                          — {resource.description}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Directory Section */}
            {displayResults.directory.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Directory
                </div>
                {displayResults.directory.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex items-start px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer group"
                  >
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="font-medium">{entry.name}</span>
                      </div>
                      <div className="text-gray-500 text-xs pl-6">
                        {entry.position} • {entry.department}
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs text-gray-600 pl-6">
                        {entry.number && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span>{entry.number}</span>
                            <CopyButton
                              value={entry.number}
                              variant="ghost"
                              className="ml-1 opacity-0 bg-transparent group-hover:opacity-100 transition-opacity duration-300 ease-in-out text-zinc-400"
                              iconSize={10}
                              disableTooltip
                            />
                          </div>
                        )}
                        {entry.extension && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span>Ext: {entry.extension}</span>
                            <CopyButton
                              value={entry.extension}
                              variant="ghost"
                              className="ml-1 opacity-0 bg-transparent group-hover:opacity-100 transition-opacity duration-300 ease-in-out text-zinc-400"
                              iconSize={10}
                              disableTooltip
                            />
                          </div>
                        )}
                        {entry.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span>{entry.email}</span>
                            <CopyButton
                              value={entry.email}
                              variant="ghost"
                              className="ml-1 opacity-0 bg-transparent group-hover:opacity-100 transition-opacity duration-600 ease-in-out text-zinc-400"
                              iconSize={10}
                              disableTooltip
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {search.length >= 2 &&
              displayResults.resources.length === 0 &&
              displayResults.directory.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No results found
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
