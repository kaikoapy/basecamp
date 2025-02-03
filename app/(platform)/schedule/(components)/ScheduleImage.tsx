"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
export function ScheduleImage() {
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <div className="min-h-screen p-4 pb-32 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button
            onClick={zoomIn}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <div
          className="h-full w-full relative"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          <Image
            src="https://4ztip6noaf.ufs.sh/f/WTe1MV8FTP1ypQnYZBDhlLAq79zRfNpovKaWb2xCsrUuM4dj"
            alt="Schedule"
            className="max-w-full h-auto"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
}
