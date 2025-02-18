"use client"

import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

// Sample data for salespeople and their performance
const salespeople = [
  "Alex Reynaldos",
  "Gabriel Oss",
  "Giovanna Salazar",
  "Juan Contreras",
  "Moudy Aglan",
  "Ronald Roeser",
  "Steven Barth",
  "Tito Dallavalle",
]

interface ActivityDetails {
  talkTime: number[]
  contacted: number[]
  nonContacted: number[]
}

interface Activity {
  name: string
  data: number[]
  threshold: number
  details?: ActivityDetails
}

const activities: Activity[] = [
  {
    name: "Outbound Calls",
    data: [45, 52, 38, 60, 41, 55, 48, 50],
    threshold: 50,
    details: {
      talkTime: [15, 18, 12, 20, 14, 19, 16, 17],
      contacted: [30, 35, 25, 40, 28, 37, 32, 34],
      nonContacted: [15, 17, 13, 20, 13, 18, 16, 16],
    },
  },
  { name: "Outbound Texts", data: [120, 135, 98, 142, 110, 128, 115, 130], threshold: 100 },
  { name: "Outbound Emails", data: [75, 82, 68, 90, 72, 85, 78, 80], threshold: 70 },
  { name: "Appointments", data: [12, 15, 10, 18, 11, 14, 13, 16], threshold: 12 },
  { name: "Cars Sold", data: [5, 7, 4, 8, 5, 6, 5, 7], threshold: 5 },
]

export default function SalesPerformanceTable() {
  const [expandedCalls, setExpandedCalls] = useState(false)

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-muted">Activity (Threshold)</TableHead>
            {salespeople.map((person, index) => (
              <TableHead key={index} className="text-center bg-muted">
                {person}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity, activityIndex) => (
            <React.Fragment key={activityIndex}>
              <TableRow>
                <TableCell className="font-medium">
                  {activity.name === "Outbound Calls" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 hover:bg-transparent font-medium text-sm"
                      onClick={() => setExpandedCalls(!expandedCalls)}
                    >
                      {activity.name} ({activity.threshold})
                      {expandedCalls ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    `${activity.name} (${activity.threshold})`
                  )}
                </TableCell>
                {activity.data.map((value, dataIndex) => (
                  <TableCell
                    key={dataIndex}
                    className={`text-center ${
                      value < activity.threshold
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }`}
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
              {activity.name === "Outbound Calls" && expandedCalls && (
                <>
                  <TableRow>
                    <TableCell className="pl-8">Talk Time (min)</TableCell>
                    {activity.details!.talkTime.map((value, index) => (
                      <TableCell key={index} className="text-center">
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Contacted</TableCell>
                    {activity.details!.contacted.map((value, index) => (
                      <TableCell key={index} className="text-center">
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Non-Contacted</TableCell>
                    {activity.details!.nonContacted.map((value, index) => (
                      <TableCell key={index} className="text-center">
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                </>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
