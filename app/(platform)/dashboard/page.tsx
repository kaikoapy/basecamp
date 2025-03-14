import { Suspense } from "react";
import { DashboardContent } from "./(components)/dashboard-content";
import Loading from "./loading";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<Loading />}>
        <DashboardContent searchQuery="" />
      </Suspense>
    </div>
  );
}


