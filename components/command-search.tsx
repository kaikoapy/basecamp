"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, ArrowUpRight } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

type Resource = Doc<"resources">;

export function SearchBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Store previous results to prevent UI flashing
  const [previousResults, setPreviousResults] = React.useState<Resource[]>([]);

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

  const displayResults = searchResults || previousResults;

  // Handle clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  // Show dropdown if searching or have results
  const showDropdown =
    isOpen && (search.length >= 2 || displayResults?.length > 0);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search resources..."
          className="w-full h-10 px-4 py-2 pl-10 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          aria-hidden="true"
        />
        <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Results Dropdown with transitions */}
      <div
        className={`absolute z-50 w-full mt-2 transform transition-all duration-200 ease-in-out ${
          showDropdown
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <div
          ref={resultsRef}
          className="bg-white rounded-md shadow-lg border overflow-hidden"
        >
          <div className="py-2 min-h-[60px]">
            {displayResults?.length === 0 && search.length >= 2 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No results found
              </div>
            ) : (
              displayResults?.map((result) => (
                <a
                  key={result._id}
                  href={result.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer group transition-colors duration-150"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex-grow">
                    <span className="font-medium">{result.title}</span>
                    {result.description && (
                      <span className="ml-2 text-gray-500">
                        — {result.description}
                      </span>
                    )}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    aria-hidden="true"
                  />
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
