/*******************************************************
 * app/page.tsx
 *******************************************************/

"use client";
import ScheduleDisplay from "./(components)/ScheduleDisplay";
import { NavHeader } from "@/components/sidebar/nav-header";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <NavHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="min-h-screen p-4">
        <ScheduleDisplay />
      </main>
    </>
  );
}
