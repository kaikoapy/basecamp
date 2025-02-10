"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  DollarSign,
  Landmark,
  Truck,
  Clock,
  Globe,
  ExternalLink,
} from "lucide-react";

interface OutOfStateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OUT_OF_STATE_PDF =
  "https://utfs.io/f/WTe1MV8FTP1ydsEEd9osOcD0ySZxn1vK5f94CE2zag7Hd8Jr";

export function OutOfStateDialog({
  open,
  onOpenChange,
}: OutOfStateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* Trigger Button - Replace with actual button if needed */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Out of State Deals</DialogTitle>
              <DialogDescription>
                Key details for out-of-state vehicle transactions:
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 mr-8"
              onClick={() =>
                window.open(
                  OUT_OF_STATE_PDF,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <ExternalLink className="h-4 w-4" />
              View Out-Of-State PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 ">
            {/* Requirements & Important Information Section */}
            <section className="space-y-4">
              <header></header>
              <div className="space-y-6 text-base">
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentation & Communication:
                  </h4>
                  <p className="pt-2">
                    For out-of-state purchases, clear communication and thorough
                    documentation are essential. Ensure you provide customers
                    with detailed photos and videos of the vehicle. Encourage
                    FaceTime sessions to offer virtual tours and help customers
                    understand the vehicle condition. This prevents
                    misunderstandings and ensures the customer has all necessary
                    information, as resolving issues after the vehicle has been
                    shipped is much more challenging.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cash Purchases:
                  </h4>
                  <p className="pt-2">
                    For cash purchases, inform customers they have the option to
                    handle their own registration and taxes at their local DMV.
                    However, let them know the vehicle must be shipped to their
                    home in these cases. Make sure they are aware they are
                    responsible for the vehicle price, dealer fee, and
                    electronic filing fee.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Financed Purchases:
                  </h4>
                  <p className="pt-2">
                    For financed purchases, customers must use one of our
                    partnered lenders. Ensure they understand that we will
                    facilitate the transaction and that outside financing is not
                    allowed.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information:
                  </h4>
                  <p className="pt-2">
                    Remind customers that they are responsible for arranging
                    their own shipping. Make sure they understand that any
                    issues during transportation are between them and their
                    chosen shipping company, as VNM is not liable for
                    transportation-related problems.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Out-of-State Registration Timing:
                  </h4>
                  <p className="pt-2">
                    Out-of-state registration often takes longer than usual. Let
                    customers know they might need up to three temporary tags
                    while waiting for the process to be completed.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Reciprocity Section */}
            <section className="space-y-4">
              <header>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  Reciprocity
                </h3>
                <p className="text-base mt-2">
                  States without reciprocity and the requirements for temporary
                  tags:
                </p>
              </header>
              <div className="space-y-4">
                <p className="text-base leading-relaxed">
                  The following states do not have reciprocity with Florida;
                  therefore, the dealership cannot issue a temporary tag for
                  driving on Florida roads:
                </p>
                <ul className="text-base leading-relaxed ml-4 list-disc">
                  <li>Alaska</li>
                  <li>Arkansas</li>
                  <li>District of Columbia (DC)</li>
                  <li>Delaware</li>
                  <li>Georgia</li>
                  <li>Iowa</li>
                  <li>Maryland</li>
                  <li>Mississippi</li>
                  <li>Montana</li>
                  <li>New Hampshire</li>
                  <li>New Mexico</li>
                  <li>North Carolina</li>
                  <li>North Dakota</li>
                  <li>Oregon</li>
                  <li>South Dakota</li>
                  <li>West Virginia</li>
                </ul>
                <p className="text-base mt-2">
                  Customers must either ship the car to their home or request a
                  temporary tag from their state&apos;s DMV before picking up
                  the vehicle.
                </p>
              </div>
            </section>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
