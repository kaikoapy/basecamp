"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Search,
  FileText,
  User,
  Mail,
  Phone,
  X,
  History,
  DollarSign,
  Wrench,
  Globe,
  Building2,
  MessageSquare,
  Store,
  ArrowUpRight,
  Maximize2,
} from "lucide-react"; // Import X icon and History
import { CopyButton } from "@/components/copy-button";
import { useDialog } from "@/components/providers/dialog-provider";
import type { Doc } from "@/convex/_generated/dataModel";
import type { Resource } from "@/types/resources";

type DirectoryEntry = Doc<"directory"> & {
  name: string;
  nickname?: string;
  position: string;
  department: string;
  extension: string;
  email: string;
  number: string;
};

interface SearchResults {
  resources: Resource[];
  directory: DirectoryEntry[];
}

export interface SearchBarHandle {
  focus: () => void;
}

function getResourceIcon(category: string) {
  switch (category.toLowerCase()) {
    case "incentives":
      return (
        <DollarSign className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-orange-400" />
      );
    case "tools":
      return (
        <Wrench className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-orange-400" />
      );
    case "volvo sites":
      return (
        <Globe className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-orange-400" />
      );
    case "dealer site":
      return (
        <Building2 className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-orange-400" />
      );
    case "communication":
      return (
        <MessageSquare className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-orange-400" />
      );
    case "dealer trade store":
      return (
        <Store className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-orange-400" />
      );
    default:
      return (
        <FileText className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-orange-400" />
      );
  }
}

export const SearchBar = React.forwardRef<SearchBarHandle>((props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const { showDialog } = useDialog();

  const [previousResults, setPreviousResults] = React.useState<SearchResults>({
    resources: [],
    directory: [],
  });

  const [recentQueries, setRecentQueries] = React.useState<string[]>([]); // Recent queries state

  const [isFocused, setIsFocused] = React.useState(false); // Track focus state

  // Define isMacOS within the component
  const isMacOS =
    typeof window !== "undefined" &&
    window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  // Expose focus method to parent via ref
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

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

  // Initialize recent queries on component mount
  React.useEffect(() => {
    setRecentQueries(getRecentQueries());
  }, []);

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
        setIsFocused(false); // Update focus state
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
        setOpenState(true);
      }
      if (e.key === "Escape") {
        setOpenState(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setOpenState(true);
  };

  // Utility function to get recent queries from localStorage
  const getRecentQueries = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("recentQueries");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading recentQueries from localStorage:", error);
      return [];
    }
  };

  // Utility function to add a query to recentQueries in localStorage
  const addRecentQuery = (query: string) => {
    if (!query.trim()) return;
    try {
      const existing = getRecentQueries();
      // Remove the query if it already exists to avoid duplicates
      const filtered = existing.filter((q) => q !== query);
      const updated = [query, ...filtered].slice(0, 5);
      localStorage.setItem("recentQueries", JSON.stringify(updated));
      setRecentQueries(updated); // Update state
    } catch (error) {
      console.error("Error adding recentQuery to localStorage:", error);
    }
  };

  // Handle resource click
  const handleResourceClick = (resource: Resource) => {
    addRecentQuery(resource.title); // Store the resource title
    setOpenState(false);
    if (resource.isModal && resource.component) {
      // Convert component name to dialog name by removing "Dialog" suffix and converting to kebab-case
      const dialogName = resource.component
        .replace(/Dialog$/, "")
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "")
        .replace(/-f-a-q$/, ""); // Remove FAQ suffix if present
      showDialog(dialogName);
    } else if (resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  };

  // Handle directory entry click (optional: if directory entries are clickable)
  const handleDirectoryEntryClick = (entry: DirectoryEntry) => {
    // Store both name and nickname if available
    addRecentQuery(
      entry.nickname ? `${entry.name} (${entry.nickname})` : entry.name
    );
    setOpenState(false);
    // Implement any additional logic for directory entry clicks if necessary
  };

  // Clear the search input
  const clearSearch = () => {
    setSearch("");
    setIsFocused(false); // Optional: Update focus state
    inputRef.current?.focus();
  };

  const setOpenState = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      inputRef.current?.focus();
    }
  };

  const showDropdown =
    isOpen &&
    (search.length >= 3 ||
      displayResults.resources.length > 0 ||
      displayResults.directory.length > 0 ||
      (search.length < 2 && recentQueries.length > 0)); // Include recent queries

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => {
            setOpenState(true);
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for resources or contacts..."
          className="w-full h-10 px-4 py-2 pl-10 pr-8 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-600/40 focus:shadow-md"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          aria-hidden="true"
        />

        {/* Conditional Rendering: Show 'X' button or 'kbd' */}
        {isFocused ? (
          <button
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent input from losing focus
              clearSearch();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <kbd className="absolute hidden md:inline-flex right-3 top-1/2 transform -translate-y-1/2 pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">{isMacOS ? "⌘" : "Ctrl"}</span>K
          </kbd>
        )}
      </div>

      {/* Results Dropdownds */}
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
            {/* Recently Viewed Section */}
            {search.length < 2 && recentQueries.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <History
                    className="h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                  Recently Viewed
                </div>
                {recentQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearch(query);
                      inputRef.current?.focus();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    type="button"
                    aria-label={`Select recently viewed item: ${query}`}
                  >
                    {query}
                  </button>
                ))}
              </div>
            )}

            {/* Resources Section */}
            {displayResults.resources.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Resources
                </div>
                {displayResults.resources.map((resource) => (
                  <div key={resource._id} className="px-2">
                    <button
                      onClick={() => handleResourceClick(resource)}
                      className="w-full group flex items-center px-3 py-2 text-sm rounded-md hover:bg-orange-50 cursor-pointer text-left transition-colors"
                      type="button"
                    >
                      <div className="flex items-center gap-2 flex-grow">
                        {getResourceIcon(resource.category)}
                        <div>
                          <span className="font-medium group-hover:text-orange-600">
                            {resource.title}
                          </span>
                          {resource.description && (
                            <span className="ml-2 text-gray-500 hidden md:inline group-hover:text-orange-500/60">
                              — {resource.description}
                            </span>
                          )}
                        </div>
                      </div>
                      {resource.url ? (
                        <ArrowUpRight
                          className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-orange-400 transition-all"
                          aria-hidden="true"
                        />
                      ) : (
                        <Maximize2
                          className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-orange-400 transition-all"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
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
                  <div key={entry._id} className="px-2">
                    <div
                      onClick={() => handleDirectoryEntryClick(entry)}
                      className="group flex items-start px-3 py-3 text-sm rounded-md hover:bg-sky-50 cursor-pointer transition-colors"
                    >
                      <div className="flex-grow space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400 shrink-0 group-hover:text-sky-400" />
                          <span className="font-medium group-hover:text-sky-600">
                            {entry.name}
                            {entry.nickname && (
                              <span className="ml-2 text-sm text-gray-500 group-hover:text-sky-500/60">
                                ({entry.nickname})
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs pl-6 group-hover:text-sky-500/60">
                          {entry.position} • {entry.department}
                        </div>
                        <div className="flex flex-col gap-1.5 pl-6">
                          {entry.number && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 shrink-0 group-hover:text-sky-400" />
                              <span className="text-gray-500 group-hover:text-sky-500">
                                {entry.number}
                              </span>
                              <CopyButton
                                value={entry.number}
                                onClick={() => addRecentQuery(entry.name)}
                                variant="ghost"
                                className="ml-1 -mr-1 h-4 w-4 p-0 opacity-0 hover:bg-transparent hover:text-sky-400 group-hover:opacity-100 transition-all"
                                iconSize={10}
                                disableTooltip
                              />
                            </div>
                          )}
                          {entry.extension && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 shrink-0 group-hover:text-sky-400" />
                              <span className="text-gray-500 group-hover:text-sky-500">
                                Ext: {entry.extension}
                              </span>
                              <CopyButton
                                value={entry.extension}
                                onClick={() => addRecentQuery(entry.name)}
                                variant="ghost"
                                className="ml-1 -mr-1 h-4 w-4 p-0 opacity-0 hover:bg-transparent hover:text-sky-400 group-hover:opacity-100 transition-all"
                                iconSize={10}
                                disableTooltip
                              />
                            </div>
                          )}
                          {entry.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 shrink-0 group-hover:text-sky-400" />
                              <span className="text-gray-500 group-hover:text-sky-500">
                                {entry.email}
                              </span>
                              <CopyButton
                                value={entry.email}
                                onClick={() => addRecentQuery(entry.name)}
                                variant="ghost"
                                className="ml-1 -mr-1 h-4 w-4 p-0 opacity-0 hover:bg-transparent hover:text-sky-400 group-hover:opacity-100 transition-all"
                                iconSize={10}
                                disableTooltip
                              />
                            </div>
                          )}
                        </div>
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
});

SearchBar.displayName = "SearchBar"; // For better debugging
