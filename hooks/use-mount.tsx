import { useState, useEffect } from "react";

export interface UseMountReturn {
  isMounted: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function useMount(): UseMountReturn {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    isMounted,
    searchQuery,
    setSearchQuery,
  };
}
