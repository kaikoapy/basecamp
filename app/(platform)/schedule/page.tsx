"use client";

import dynamic from "next/dynamic";
import { DebugRole } from "../(components)/debug-role";
import { StaffScheduleSkeleton } from "./(components)/staff-schedule-skeleton";
import { Suspense } from "react";

const StaffSchedule = dynamic(
  () => import("./(components)/staff-schedule"),
  { 
    ssr: false,
    loading: () => <StaffScheduleSkeleton />
  }
);

export default function SchedulePage() {
  return (
    <div className="bg-[rgb(250,250,252)]">
      <DebugRole />
      <Suspense fallback={<StaffScheduleSkeleton />}>
        <StaffSchedule />
      </Suspense>
    </div>
  );
}
