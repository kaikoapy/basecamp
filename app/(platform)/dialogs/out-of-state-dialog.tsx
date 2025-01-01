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
          <DialogTitle>Out of State Deals</DialogTitle>
          <DialogDescription>
            Key details for out-of-state vehicle transactions:
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 py-6">
            {/* Requirements & Important Information Section */}
            <section className="space-y-4">
              <header>
                <h3 className="text-xl font-bold">
                  Requirements & Important Information
                </h3>
              </header>
              <div className="space-y-6 text-base">
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentation & Communication:
                  </h4>
                  <p>
                    Due to the remote nature of out-of-state purchases, thorough
                    documentation and clear communication are essential. We
                    provide extensive photo and video documentation of the
                    vehicle, and recommend FaceTime sessions to give customers a
                    detailed virtual tour. This extra level of documentation
                    helps prevent misunderstandings and ensures customers are
                    fully informed, as addressing issues after the vehicle
                    leaves our area becomes significantly more challenging.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    For Cash Purchases:
                  </h4>
                  <p>
                    Customers paying cash can register and pay taxes for their
                    purchase themselves at their local DMV. However, the vehicle
                    must be shipped to their home if this option is chosen.
                    Customers are responsible for paying the selling price,
                    dealer fee, and electronic filing fee.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    For Financed Purchases:
                  </h4>
                  <p>
                    Customers financing their vehicle must use one of our
                    partnered lenders, where we facilitate the transaction.
                    Outside financing is not allowed.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information:
                  </h4>
                  <p>
                    Customers are responsible for sourcing their own shipping
                    company. Any liabilities or issues during transportation are
                    solely between the customer and their chosen shipping
                    company. VNM is not responsible for transportation-related
                    issues.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Out-of-State Registration Timing:
                  </h4>
                  <p>
                    Registration for out-of-state purchases can take
                    significantly longer. Customers may require up to three
                    temporary tags due to the extended time needed for
                    processing.
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
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
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
