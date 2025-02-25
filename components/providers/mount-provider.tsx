"use client";

import { useMount } from "@/hooks/use-mount";
import { NavHeader } from "@/app/(platform)/(components)/sidebar/nav-header";
import React, { ReactElement } from "react";

interface WithSearchQuery {
  searchQuery?: string;
}

interface MountProviderProps {
  children: React.ReactNode;
}

export function MountProvider({ children }: MountProviderProps) {
  const { isMounted, searchQuery } = useMount();

  if (!isMounted) {
    return null;
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) && 
      typeof child.type !== 'string' &&
      React.isValidElement<WithSearchQuery>(child)
    ) {
      return React.cloneElement<WithSearchQuery>(
        child as ReactElement<WithSearchQuery>,
        { searchQuery }
      );
    }
    return child;
  });

  return (
    <>
      <NavHeader />
      {childrenWithProps}
    </>
  );
}
