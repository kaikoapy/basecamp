"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintBusinessApplicationProps {
  pdfUrl: string;
}

export function PrintBusinessApplication({
  pdfUrl,
}: PrintBusinessApplicationProps) {
  const handlePrint = () => {
    // Open PDF in new window
    const printWindow = window.open(pdfUrl, "_blank");

    // If window opened successfully, trigger print
    if (printWindow) {
      printWindow.onload = function () {
        printWindow.print();
      };
    }
  };

  return (
    <Button
      onClick={handlePrint}
      variant="outline"
      className="w-full flex items-center gap-2"
    >
      <Printer className="h-4 w-4" />
      Print Business Application
    </Button>
  );
}
