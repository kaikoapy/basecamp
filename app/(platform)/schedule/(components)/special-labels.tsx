"use client";

import { DroppableContainer } from "./droppable-container";
import { DraggableItem } from "./draggable-item";
import { parseName } from "../utils";

interface SpecialLabelsProps {
  labels: string[];
}

export function SpecialLabels({ labels }: SpecialLabelsProps) {
  return (
    <>
      <h2 className="text-xl font-bold mt-6 mb-4">Special Labels</h2>
      <DroppableContainer id="special-labels-list">
        <div className="flex flex-wrap">
          {labels.map(item => (
            <DraggableItem key={item} id={item} containerId="special-labels-list">
              <div className="bg-white text-black border border-black m-2 p-2 rounded-md shadow-sm text-center">
                {parseName(item)}
              </div>
            </DraggableItem>
          ))}
        </div>
      </DroppableContainer>
    </>
  );
} 