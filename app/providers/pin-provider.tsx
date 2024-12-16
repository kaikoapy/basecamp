"use client";

import { createContext, useContext, useState } from "react";

type PinContextType = {
  pinnedItems: Set<string>;
  togglePin: (id: string) => void;
};

const PinContext = createContext<PinContextType | undefined>(undefined);

export function PinProvider({ children }: { children: React.ReactNode }) {
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(new Set());

  const togglePin = (id: string) => {
    setPinnedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <PinContext.Provider value={{ pinnedItems, togglePin }}>
      {children}
    </PinContext.Provider>
  );
}

export function usePin() {
  const context = useContext(PinContext);
  if (context === undefined) {
    throw new Error("usePin must be used within a PinProvider");
  }
  return context;
}
