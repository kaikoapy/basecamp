"use client";

import { useState } from "react";
import { AppSidebar } from "../../components/app-sidebar";
import { MarketingCard } from "../../components/marketing-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  announcements,
  pinnedContent,
  tools,
  resources,
  widgets,
} from "../data/dashboard-content";
import Image from "next/image";
import { PinProvider } from "../providers/pin-provider";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { SearchWidgetCard } from "@/components/search-widget-card";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContent = {
    announcements: announcements.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    pinnedContent: pinnedContent.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    tools: tools.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    resources: resources.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  return (
    <PinProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b sticky top-0 bg-background z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <Image
                src="https://utfs.io/f/WTe1MV8FTP1yrYpOrRHKQvElgKmYat2NTfp9hIdML7Rx8JWP"
                alt="Volvo Cars North Miami Logo"
                width={140}
                height={40}
                className="object-contain"
                priority
              />
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tools..."
                  className="w-[200px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <OnboardingDialog />
          </header>
          <main className="flex-1 p-6">
            <section className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                {widgets.map((widget, index) => {
                  if (widget.type === "search") {
                    return <SearchWidgetCard key={index} />;
                  }
                  return null;
                })}
              </div>
            </section>

            {filteredContent.announcements.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Announcements</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredContent.announcements.map((announcement, index) => (
                    <MarketingCard
                      key={index}
                      id={`announcement-${index}`}
                      {...announcement}
                    />
                  ))}
                </div>
              </section>
            )}

            {filteredContent.pinnedContent.length > 0 && (
              <section id="quick-access" className="mb-8 scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredContent.pinnedContent.map((content, index) => (
                    <MarketingCard
                      key={index}
                      id={`pinned-${index}`}
                      {...content}
                    />
                  ))}
                </div>
              </section>
            )}

            <section id="incentives" className="mb-8 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4">Incentives</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredContent.tools
                  .filter((tool) => tool.category === "Incentives")
                  .map((content, index) => (
                    <MarketingCard
                      key={index}
                      id={`incentive-${index}`}
                      {...content}
                    />
                  ))}
              </div>
            </section>

            {filteredContent.tools.filter(
              (tool) => tool.category !== "Incentives"
            ).length > 0 && (
              <section id="tools" className="mb-8 scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4">Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredContent.tools
                    .filter((tool) => tool.category !== "Incentives")
                    .map((content, index) => (
                      <MarketingCard
                        key={index}
                        id={`tool-${index}`}
                        {...content}
                      />
                    ))}
                </div>
              </section>
            )}

            {filteredContent.resources.length > 0 && (
              <section id="resources" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4">Resources</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredContent.resources.map((content, index) => (
                    <MarketingCard
                      key={index}
                      id={`resource-${index}`}
                      {...content}
                    />
                  ))}
                </div>
              </section>
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </PinProvider>
  );
}
