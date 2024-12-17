"use client";

import { useMount } from "@/hooks/use-mount";
import { NavHeader } from "@/components/sidebar/nav-header";

interface MountProviderProps {
  children: React.ReactNode;
}

export function MountProvider({ children }: MountProviderProps) {
  const { isMounted, searchQuery, setSearchQuery } = useMount();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NavHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {children}
    </>
  );
}
