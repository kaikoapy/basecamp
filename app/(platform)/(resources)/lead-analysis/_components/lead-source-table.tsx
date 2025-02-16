"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface LeadSourceData {
  source: string;
  newLeads: number;
  contacted: number;
  storeVisits: number;
  apptsOpened: number;
  apptsShown: number;
  noShows: number;
  sales: number;
  details: {
    tracking: string;
    newLeads: number;
    contacted: number;
    storeVisits: number;
    apptsOpened: number;
    apptsShown: number;
    noShows: number;
    sales: number;
  }[];
}

interface LeadSourceTableProps {
  data: LeadSourceData[];
}

export function LeadSourceTable({ data }: LeadSourceTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Calculate totals
  const totals = data.reduce(
    (acc, row) => ({
      newLeads: acc.newLeads + row.newLeads,
      contacted: acc.contacted + row.contacted,
      storeVisits: acc.storeVisits + row.storeVisits,
      apptsOpened: acc.apptsOpened + row.apptsOpened,
      apptsShown: acc.apptsShown + row.apptsShown,
      noShows: acc.noShows + row.noShows,
      sales: acc.sales + row.sales,
    }),
    {
      newLeads: 0,
      contacted: 0,
      storeVisits: 0,
      apptsOpened: 0,
      apptsShown: 0,
      noShows: 0,
      sales: 0,
    }
  );

  // Calculate percentages for the totals
  const percentages = {
    contactRate: ((totals.contacted / totals.newLeads) * 100).toFixed(1),
    visitRate: ((totals.storeVisits / totals.contacted) * 100).toFixed(1),
    showRate: ((totals.apptsShown / totals.apptsOpened) * 100).toFixed(1),
    closeRate: ((totals.sales / totals.apptsShown) * 100).toFixed(1),
  };

  const toggleRow = (source: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [source]: !prev[source],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Source Performance</CardTitle>
        <CardDescription>
          Detailed breakdown of lead performance metrics by source
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="p-4">
              <CardDescription>Contact Rate</CardDescription>
              <CardTitle>{percentages.contactRate}%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardDescription>Visit Rate</CardDescription>
              <CardTitle>{percentages.visitRate}%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardDescription>Show Rate</CardDescription>
              <CardTitle>{percentages.showRate}%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardDescription>Close Rate</CardDescription>
              <CardTitle>{percentages.closeRate}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">New Leads</TableHead>
                <TableHead className="text-right">Contacted</TableHead>
                <TableHead className="text-right">Store Visits</TableHead>
                <TableHead className="text-right">Appts Opened</TableHead>
                <TableHead className="text-right">Appts Shown</TableHead>
                <TableHead className="text-right">No Shows</TableHead>
                <TableHead className="text-right">Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <React.Fragment key={row.source}>
                  <TableRow className="group">
                    <TableCell className="w-[30px] p-2">
                      {row.details.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleRow(row.source)}
                        >
                          {expandedRows[row.source] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{row.source}</TableCell>
                    <TableCell className="text-right">{row.newLeads}</TableCell>
                    <TableCell className="text-right">{row.contacted}</TableCell>
                    <TableCell className="text-right">{row.storeVisits}</TableCell>
                    <TableCell className="text-right">{row.apptsOpened}</TableCell>
                    <TableCell className="text-right">{row.apptsShown}</TableCell>
                    <TableCell className="text-right">{row.noShows}</TableCell>
                    <TableCell className="text-right">{row.sales}</TableCell>
                  </TableRow>
                  {expandedRows[row.source] && row.details.map((detail, index) => (
                    <TableRow 
                      key={`${row.source}-${detail.tracking}-${index}`}
                      className="bg-muted/50"
                    >
                      <TableCell className="w-[30px]"></TableCell>
                      <TableCell className="pl-8 text-sm text-muted-foreground">
                        {detail.tracking}
                      </TableCell>
                      <TableCell className="text-right text-sm">{detail.newLeads}</TableCell>
                      <TableCell className="text-right text-sm">{detail.contacted}</TableCell>
                      <TableCell className="text-right text-sm">{detail.storeVisits}</TableCell>
                      <TableCell className="text-right text-sm">{detail.apptsOpened}</TableCell>
                      <TableCell className="text-right text-sm">{detail.apptsShown}</TableCell>
                      <TableCell className="text-right text-sm">{detail.noShows}</TableCell>
                      <TableCell className="text-right text-sm">{detail.sales}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
              <TableRow className="bg-primary/5 font-medium">
                <TableCell className="w-[30px]"></TableCell>
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totals.newLeads}</TableCell>
                <TableCell className="text-right">{totals.contacted}</TableCell>
                <TableCell className="text-right">{totals.storeVisits}</TableCell>
                <TableCell className="text-right">{totals.apptsOpened}</TableCell>
                <TableCell className="text-right">{totals.apptsShown}</TableCell>
                <TableCell className="text-right">{totals.noShows}</TableCell>
                <TableCell className="text-right">{totals.sales}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 