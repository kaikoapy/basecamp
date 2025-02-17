"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface DraggableItemProps {
  id: string;
  containerId: string;
  children: React.ReactNode;
  className?: string;
}

export function DraggableItem({ id, containerId, children, className }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, data: { containerId } });
  
  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
} 