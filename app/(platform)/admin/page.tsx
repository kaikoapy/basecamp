import { Suspense } from "react"
import SalesPerformanceTable from "./_components/activity-table"
import { Component as LeadConversion } from "./_components/lead-converstion"
import { Component as LeadDistribution } from "./_components/lead-distribution"
import { Component as LeadSources } from "./_components/lead-sources"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DateRangePicker } from "./_components/date-range-picker"

function ActivityTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales Performance Dashboard</h1>
        <DateRangePicker />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ActivityTableSkeleton />}>
            <SalesPerformanceTable />
          </Suspense>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <LeadConversion />
        </Suspense>
        
        <Suspense fallback={<ChartSkeleton />}>
          <LeadDistribution />
        </Suspense>
        
        <Suspense fallback={<ChartSkeleton />}>
          <LeadSources />
        </Suspense>
      </div>
    </div>
  )
}
