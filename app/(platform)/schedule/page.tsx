"use client";

import dynamic from "next/dynamic";
import { DebugRole } from "../(components)/debug-role";

const StaffSchedule = dynamic(
  () => import("./(components)/staff-schedule"),
  { ssr: false }
);

function StaffScheduleWrapper() {
  return <StaffSchedule />;
}

export default function SchedulePage() {
  return (
    <>
      <div className="bg-[rgb(250,250,252)]">
        <DebugRole />
        <StaffScheduleWrapper />
      </div>
    </>
  );
}
