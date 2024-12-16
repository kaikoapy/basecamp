/*******************************************************
 * app/page.tsx
 *******************************************************/

"use client";
import ScheduleDisplay from "./(components)/ScheduleDisplay";
import { DashboardHeader } from "../dashboard/components/dashboard-header";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <DashboardHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="min-h-screen p-4">
        <ScheduleDisplay />
      </main>
    </>
  );
}
