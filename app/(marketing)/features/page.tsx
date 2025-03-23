import { Metadata } from "next";
import { TemplateCard } from "./_components/template-card";
import { Hero } from "./_components/hero";
import { CtaSection } from "../_components/cta-section";
import React from "react";

export const metadata: Metadata = {
  title: "Features",
  description: "Main dashboard with quick access to essential tools and resources",
};

interface DashboardItem {
  title: string;
  description: string | (string | React.ReactNode)[];
}

const dashboardItems: DashboardItem[] = [
    {
      title: "Dashboard",
      description: ["This is ", <i key="italic">the basecamp</i>, " where everything begins. Find store wide announcements, resource links, and side and navbar with intuitive search and quick-access navigation, it's the starting point for every successful day."]
    },
    {
      title: "Resources",
      description: "Essential tools including gas calculator, out-of-state guides, and dealer trade information. Access payoff details, printable documents, new hire resources, and an interactive dealer map with FAQ support."
    },
    {
      title: "Directory",
      description: "Comprehensive staff listings with powerful search that recognizes both formal names and nicknames. Designed for quick lookups with a streamlined interface for easy administrative updates."
    },
    {
      title: "Schedule",
      description: "Create, edit and print schedules with flexible publishing controls. Hide sensitive scheduling information until finalized to ensure only approved schedules are visible to the team."
    },
    {
      title: "Product Training",
      description: "Stay current with latest Volvo product knowledge through regularly updated materials. Includes actual customer FAQs, time-saving templates, and comprehensive training resources for consistent messaging."
    }
  ];

export default function DashboardPage() {
  return (
    <div className="relative">
      <div className="absolute -z-10 top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_0%_0%,rgba(106,104,241,0.05)_0,rgba(106,104,241,0)_50%),radial-gradient(circle_at_100%_0%,rgba(106,104,241,0.05)_0,rgba(106,104,241,0)_50%)]"></div>
      <div className="max-w-6xl mx-auto ">
        <Hero />
        
        {/* Features Grid */}
        <div className="px-6 space-y-12">
          {dashboardItems.map((item) => (
            <section key={item.title} id={item.title.toLowerCase()} className="scroll-mt-12">
              <TemplateCard
                {...item}
              />
            </section>
          ))}
        </div>

        {/* CTA Section */}
        <div className="px-6 py-24">
          <CtaSection />
        </div>
      </div>
    </div>
  );
} 