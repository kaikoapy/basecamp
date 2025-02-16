"use client";

import { useDroppable } from "@dnd-kit/core";

interface DroppableContainerProps {
  id: string;
  children: React.ReactNode;
}

export function DroppableContainer({ id, children }: DroppableContainerProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    backgroundColor: isOver ? "rgba(224,247,250,0.5)" : "transparent",
    padding: "4px",
    borderRadius: "4px",
  };
  return <div ref={setNodeRef} style={style}>{children}</div>;
} 