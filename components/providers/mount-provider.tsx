"use client";

import { useMount } from "@/hooks/use-mount";
import { NavHeader } from "@/app/(platform)/(components)/sidebar/nav-header";
import React from "react";

interface MountProviderProps {
  children: React.ReactNode;
}

export function MountProvider({ children }: MountProviderProps) {
  const { isMounted } = useMount();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="print:hidden">
        <NavHeader />
      </div>
      {children}
    </>
  );
}
