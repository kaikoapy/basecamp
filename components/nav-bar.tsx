"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building, CalendarDays, Clock, MapPin, Phone } from "lucide-react";

const dealerInfo = {
  name: "Volvo Cars North Miami",
  address: "19275 NW 2nd Ave, Miami, FL 33169",
  googleMapsUrl: "https://maps.google.com/?q=Volvo+Cars+North+Miami",
  departments: [
    {
      name: "Sales",
      hours: "Mon-Fri: 9AM-8PM\nSat: 9AM-7PM\nSun: 11AM-5PM",
      phone: "(786) 374-0500",
    },
    {
      name: "Service",
      hours: "Mon-Fri: 7:30AM-6PM\nSat: 8AM-5PM\nSun: Closed",
      phone: "(786) 374-0500",
    },
    {
      name: "Parts",
      hours: "Mon-Fri: 7:30AM-6PM\nSat: 8AM-5PM\nSun: Closed",
      phone: "(786) 374-0500",
    },
  ],
};

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-semibold">Dealer Hub</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex justify-end space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                  <Building className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px]">
                <DropdownMenuLabel>Dealer Information</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <div className="flex items-center text-sm font-medium">
                      <MapPin className="mr-2 h-4 w-4" />
                      Address
                    </div>
                    <a
                      href={dealerInfo.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-6 text-sm text-muted-foreground hover:underline"
                    >
                      {dealerInfo.address}
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {dealerInfo.departments.map((dept) => (
                  <React.Fragment key={dept.name}>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{dept.name}</DropdownMenuLabel>
                      <DropdownMenuItem className="flex flex-col items-start">
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4" />
                          <span className="whitespace-pre-line">
                            {dept.hours}
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        <a
                          href={`tel:${dept.phone}`}
                          className="text-sm hover:underline"
                        >
                          {dept.phone}
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0" asChild>
              <Link href="/schedule">
                <CalendarDays className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
