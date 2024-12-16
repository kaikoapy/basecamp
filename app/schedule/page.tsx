/*******************************************************
 * app/page.tsx
 *******************************************************/

import ScheduleDisplay from "./(components)/ScheduleDisplay";

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <ScheduleDisplay />
    </main>
  );
}
