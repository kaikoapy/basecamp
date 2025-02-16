"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DraggableItemProps {
  id: string;
  containerId: string;
  children: React.ReactNode;
}

export function DraggableItem({ id, containerId, children }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, data: { containerId } });
  const style = {
    transform: CSS.Transform.toString(transform),
    cursor: "grab",
    opacity: isDragging ? 0 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
} 