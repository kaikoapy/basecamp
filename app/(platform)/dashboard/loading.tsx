import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function DashboardCardSkeleton() {
  return (
    <Card className="group relative overflow-hidden">
      <div className="p-0">
        <div className="relative aspect-video">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="p-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex items-center gap-1 shrink-0">
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function DashboardLoading() {
  return (
    <main className="p-6">
      {/* Quick Access Section */}
      <section className="mb-6">
        <Skeleton className="h-8 w-48 mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section className="mb-6">
        <Skeleton className="h-8 w-32 mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Volvo Sites Section */}
      <section className="mb-6">
        <Skeleton className="h-8 w-40 mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
