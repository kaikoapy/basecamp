"use client";

import { LeaseDisclosure } from "./LeaseDisclosureCard";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";

interface LeaseTemplateButtonProps {
  disclosure: LeaseDisclosure;
}

export function LeaseTemplateButton({ disclosure }: LeaseTemplateButtonProps) {
  // Calculate if the ad is actually transparent
  const determineTransparency = () => {
    const hasAdditionalFees = 
      Number(disclosure.fullPaymentDetails.additionalFees.bankAcquisitionFee.replace(/[^0-9.-]+/g, '')) > 0 ||
      Number(disclosure.fullPaymentDetails.additionalFees.dealerFee.replace(/[^0-9.-]+/g, '')) > 0 ||
      Number(disclosure.fullPaymentDetails.additionalFees.tagFees.replace(/[^0-9.-]+/g, '')) > 0 ||
      Number(disclosure.fullPaymentDetails.additionalFees.electronicFee.replace(/[^0-9.-]+/g, '')) > 0;

    return !hasAdditionalFees;
  };

  const calculateTotalDueAtSigning = () => {
    const downPayment = Number(disclosure.fullPaymentDetails.paymentDetails.downPayment.replace(/[^0-9.-]+/g, ''));
    const firstMonth = Number(disclosure.fullPaymentDetails.paymentDetails.firstMonthPayment.replace(/[^0-9.-]+/g, ''));
    const bankFee = Number(disclosure.fullPaymentDetails.additionalFees.bankAcquisitionFee.replace(/[^0-9.-]+/g, ''));
    const dealerFee = Number(disclosure.fullPaymentDetails.additionalFees.dealerFee.replace(/[^0-9.-]+/g, ''));
    const tagFees = Number(disclosure.fullPaymentDetails.additionalFees.tagFees.replace(/[^0-9.-]+/g, ''));
    const electronicFee = Number(disclosure.fullPaymentDetails.additionalFees.electronicFee.replace(/[^0-9.-]+/g, ''));

    const total = downPayment + firstMonth + bankFee + dealerFee + tagFees + electronicFee;
    return total;
  };

  const calculateDifference = () => {
    const advertised = Number(disclosure.advertisementOverview.advertisedDownPayment.replace(/[^0-9.-]+/g, ''));
    const totalActual = calculateTotalDueAtSigning();
    const difference = totalActual - advertised;
    
    return difference > 0 ? `$${difference.toLocaleString()} more than advertised` : '';
  };

  const generateTemplate = () => {
    const baseAmount = Number(disclosure.advertisementOverview.advertisedMonthlyPayment.replace(/[^0-9.-]+/g, ''));
    const withTax = baseAmount * 1.07;
    const difference = calculateDifference();
    const isActuallyTransparent = determineTransparency();
    const totalDue = calculateTotalDueAtSigning();
    
    return `Hey [Customer Name],

Just saw the lease ad you sent for the ${disclosure.advertisementOverview.vehicleModel}. It looks like it's ${disclosure.advertisementOverview.advertisedMonthlyPayment} a month with a ${disclosure.advertisementOverview.advertisedDownPayment} down payment, but there's more to it when you look into the disclosure:

Advertised Prices:
• Monthly Payment: ${disclosure.advertisementOverview.advertisedMonthlyPayment}
• Down Payment: ${disclosure.advertisementOverview.advertisedDownPayment}

Real Deal (After Disclosure):
• Monthly Payment (with tax): $${withTax.toFixed(0)}
• Total Due at Signing: $${totalDue.toLocaleString()}${difference ? ` (${difference})` : ''}

Here's how the actual amount due at signing is calculated:

Due at Signing:
• Down Payment: ${disclosure.fullPaymentDetails.paymentDetails.downPayment}
• First Month's Payment: ${disclosure.fullPaymentDetails.paymentDetails.firstMonthPayment}

${isActuallyTransparent ? 'Fees (Included in Due at Signing):' : 'Additional Fees:'}
• Bank Acquisition Fee: ${disclosure.fullPaymentDetails.additionalFees.bankAcquisitionFee}
• Dealer Fee: ${disclosure.fullPaymentDetails.additionalFees.dealerFee}
• Tag Fees: ${disclosure.fullPaymentDetails.additionalFees.tagFees}
• Electronic Fee: ${disclosure.fullPaymentDetails.additionalFees.electronicFee}

Stipulations:
• Volvo Loyalty: ${disclosure.fullPaymentDetails.requiredDiscounts.volvoLoyalty}
• Affinity/A-plan: ${disclosure.fullPaymentDetails.requiredDiscounts.affinityAplan}
• FWD to AWD Allowance: ${disclosure.fullPaymentDetails.requiredDiscounts.fwdToAwdAllowance}
• Max MSRP: ${disclosure.fullPaymentDetails.vehicleRequirements.msrp}

${isActuallyTransparent 
  ? `While all fees are included in the advertised amount, these prices are only available if you:
  • Qualify for all stipulations listed above
  • Choose a vehicle at or below ${disclosure.fullPaymentDetails.vehicleRequirements.msrp}
  • Are comfortable with ${disclosure.fullPaymentDetails.vehicleRequirements.mileageLimit.annualMiles} miles per year`
  : `These extras add up to ${difference} and that's if you qualify for all the stipulations and only need ${disclosure.fullPaymentDetails.vehicleRequirements.mileageLimit.annualMiles} miles per year.`}

One more thing - the cars in the ad are usually not even available; they could be sold, loaners, or otherwise unavailable.

I hope this makes the lease terms clearer for you. We always aim to be transparent with our figures to ensure there are no surprises or misunderstandings. Let me know if you have any more questions or need anything else!`;
  };

  const handleCopyTemplate = async () => {
    const template = generateTemplate();
    await navigator.clipboard.writeText(template);
    toast.success("Template copied to clipboard!");
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          onClick={handleCopyTemplate}
          className="flex items-center gap-2"
          variant="outline"
        >
          <ClipboardCopy className="h-4 w-4" />
          Copy Response Template
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[450px] p-4">
        <div className="space-y-2">
          <h4 className="font-medium">Copy Response Template</h4>
          <div className="text-sm text-muted-foreground max-h-[400px] overflow-y-auto whitespace-pre-wrap font-mono">
            {generateTemplate()}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
} 