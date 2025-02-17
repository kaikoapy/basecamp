"use client";

import { DragOverlay } from "@dnd-kit/core";
import { parseName } from "../utils";

interface DragOverlayWrapperProps {
  activeId: string | null;
}

export function DragOverlayWrapper({ activeId }: DragOverlayWrapperProps) {
  return (
    <DragOverlay>
      {activeId ? (
        <div className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-md shadow-sm text-xs">
          {parseName(activeId)}
        </div>
      ) : null}
    </DragOverlay>
  );
} 