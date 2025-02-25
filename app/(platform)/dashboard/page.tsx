import { Suspense } from "react";
import { DashboardContent } from "./(components)/dashboard-content";
import Loading from "./loading";

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardContent searchQuery="" />
    </Suspense>
  );
}


