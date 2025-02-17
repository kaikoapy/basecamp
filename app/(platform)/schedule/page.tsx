import dynamic from "next/dynamic";
import { DebugRole } from "../(components)/debug-role";

const StaffSchedule = dynamic(
  () => import("./(components)/staff-schedule"),
  { ssr: false }
);

export default function SchedulePage() {
  return (
    <>
      <DebugRole />
      <StaffSchedule />
    </>
  );
}
