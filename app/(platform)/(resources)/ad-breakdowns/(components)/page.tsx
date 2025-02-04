import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, Search } from "lucide-react";

export interface LeaseDisclosure {
  advertisementOverview: {
    vehicleModel: string;
    advertisedMonthlyPayment: string;
    advertisedDownPayment: string;
  };
  finePrintSummary: {
    actuallyDueAtSigning: string;
    difference: string;
    monthlyPaymentDetail: string;
  };
  fullPaymentDetails: {
    paymentDetails: {
      monthlyPayment: string;
      downPayment: string;
      firstMonthPayment: string;
    };
    additionalFees: {
      bankAcquisitionFee: string;
      dealerFee: string;
      tagFees: string;
      electronicFee: string;
    };
    requiredDiscounts: {
      volvoLoyalty: string;
      affinityAplan: string;
      fwdToAwdAllowance: string;
    };
    vehicleRequirements: {
      model: string;
      msrp: string;
    };
  };
}

interface AdComparisonCardProps {
  ad: LeaseDisclosure;
}

export default function AdComparisonCard({ ad }: AdComparisonCardProps) {
  // Calculate difference between the "advertised down payment" and the "actually due at signing"
  const advertisedDownPaymentValue = Number(
    ad.advertisementOverview.advertisedDownPayment.replace(/[^0-9.]/g, "")
  );
  const actuallyDueAtSigningValue = Number(
    ad.finePrintSummary.actuallyDueAtSigning.replace(/[^0-9.]/g, "")
  );
  const difference = actuallyDueAtSigningValue - advertisedDownPaymentValue;

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] rounded-[24px] border-gray-100">
      <CardHeader className="px-8 pt-8">
        <CardTitle className="text-3xl font-bold">
          {ad.advertisementOverview.vehicleModel}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="space-y-8">
          {/* Advertisement Section */}
          <div className="rounded-2xl bg-[rgb(240,245,255)] p-8">
            <h3 className="font-semibold text-2xl text-gray-900 mb-4">Advertisement Shows</h3>
            <div className="space-y-2">
              <p className="text-2xl font-medium">
                {ad.advertisementOverview.advertisedMonthlyPayment}
              </p>
              <p className="text-xl text-gray-600">
                {ad.advertisementOverview.advertisedDownPayment}
              </p>
            </div>
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="details" className="border-t border-gray-200">
                <AccordionTrigger className="text-base text-gray-600 hover:text-gray-900 group">
                  <span className="flex items-center">
                    <Search className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-600" />
                    View Fine Print
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-lg">
                    {ad.finePrintSummary.monthlyPaymentDetail}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Actual Payment Section */}
          <div className="rounded-2xl bg-white border-2 border-red-100 p-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-2xl text-gray-900">Actually Due at Signing</h3>
                <p className="text-4xl font-bold text-red-500 mt-4">
                  {ad.finePrintSummary.actuallyDueAtSigning}
                </p>
                {difference > 0 && (
                  <p className="text-red-500 font-medium text-lg mt-2">
                    {difference.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}{" "}
                    more than advertised
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xl text-gray-900">
                {ad.fullPaymentDetails.paymentDetails.monthlyPayment}
              </p>
            </div>

            {/* Full Details Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-semibold text-xl mb-4">Full Details</h4>
              <div className="grid gap-4">
                {/* Payment Details */}
                <div className="rounded-xl py-4 border-b border-gray-200 last:border-b-0">
                  <h5 className="font-medium mb-3">Payment Details</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Monthly Payment</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.paymentDetails.monthlyPayment}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Down Payment</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.paymentDetails.downPayment}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>First Month Payment</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.paymentDetails.firstMonthPayment}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Additional Fees */}
                <div className="rounded-xl py-4 border-b border-gray-200 last:border-b-0">
                  <h5 className="font-medium mb-3">Additional Fees</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Bank Acquisition Fee</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.additionalFees.bankAcquisitionFee}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dealer Fee</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.additionalFees.dealerFee}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tag Fees</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.additionalFees.tagFees}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Electronic Fee</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.additionalFees.electronicFee}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Required Discounts */}
                <div className="rounded-xl py-4 border-b border-gray-200 last:border-b-0">
                  <h5 className="font-medium mb-3">Required Discounts</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Volvo Loyalty</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.requiredDiscounts.volvoLoyalty}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Affinity/A-plan</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.requiredDiscounts.affinityAplan}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>FWD to AWD Allowance</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.requiredDiscounts.fwdToAwdAllowance}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Vehicle Requirements */}
                <div className="rounded-xl py-4 border-b border-gray-200 last:border-b-0">
                  <h5 className="font-medium mb-3">Vehicle Requirements</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Model</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.vehicleRequirements.model} specifically
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>MSRP</span>
                      <span className="font-medium">
                        {ad.fullPaymentDetails.vehicleRequirements.msrp}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
