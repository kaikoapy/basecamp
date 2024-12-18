"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ThirdPartyPayoffsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const payOffData = [
  {
    automaker: "Acura/Honda",
    phone: "Acura: (866) 777-6495 Honda: (800) 708-6555",
    buyout: "❌",
  },
  {
    automaker: "Alfa Romeo",
    phone: "Chrysler Cap: (855) 563-5635 Ally: (888) 925-2559",
    buyout: "Chrysler Cap: ✅ (Tricky) Ally: ✅ (Inflated)",
  },
  {
    automaker: "Audi",
    phone: "(888) 237-2834",
    buyout: "✅ (Inflated Payoff)",
  },
  { automaker: "BMW", phone: "(800) 831-1117", buyout: "❌" },
  {
    automaker: "Chrysler Capital (Chrysler, Dodge, Jeep, Ram, Fiat)",
    phone: "(855) 563-5635",
    buyout: "✅ (Tricky)",
  },
  { automaker: "Ford", phone: "(800) 727-7000", buyout: "❌" },
  {
    automaker: "GM (Buick, Chevrolet, Cadillac, GMC)",
    phone: "(800) 284-2271",
    buyout: "❌",
  },
  { automaker: "Hyundai", phone: "(800) 523-4030", buyout: "❌" },
  { automaker: "Infiniti/Nissan", phone: "(800) 456-6622", buyout: "❌" },
  {
    automaker: "Land Rover",
    phone: "Chase: (800) 336-6675 Ally: (888) 925-2559",
    buyout: "Chase: ✅ Ally: ✅ (Inflated)",
  },
  { automaker: "Lexus", phone: "(800) 874-7050", buyout: "✅" },
  { automaker: "Mazda", phone: "(866) 693-2332", buyout: "✅" },
  {
    automaker: "Mercedes",
    phone: "(800) 654-6222 / (800) 873-5471",
    buyout: "✅",
  },
  { automaker: "Subaru", phone: "Chase: (800) 336-6675", buyout: "✅" },
  { automaker: "Tesla", phone: "(844) 837-5285", buyout: "❌" },
  { automaker: "Toyota", phone: "(800) 874-8822", buyout: "✅" },
  {
    automaker: "Volkswagen",
    phone: "(800) 428-4034",
    buyout: "✅ (Inflated Payoff)",
  },
];

export function ThirdPartyPayoffsDialog({
  open,
  onOpenChange,
}: ThirdPartyPayoffsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Pay Off Numbers
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto pr-6">
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Automaker/Financer</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>3rd Party Lease Buyout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payOffData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.automaker}
                      </TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.buyout}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✅ - Third-party lease buyouts allowed</p>
              <p>❌ - Third-party lease buyouts not allowed</p>

              <div className="flex gap-2 items-start mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Always call each institution yourself to confirm if 3rd party
                  lease buyouts are allowed. This is solely a guide that
                  provides you with all the phone numbers in one place and the
                  response I received this month. If there are only a few
                  remaining payments, we may be able to compensate the customer
                  for those payments without buying the lease. Or managers may
                  have a loophole to buy out leases. Don&apos;t rule anything
                  out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
