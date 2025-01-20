"use client";

import { useAuth } from "@clerk/nextjs";

export function usePermission(permission: string) {
  const { has, isLoaded } = useAuth();
  
  if (!isLoaded) return false;
  
  return has({ permission });
}