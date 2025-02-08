"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, Search } from "lucide-react";
import { LeaseTemplateButton } from "./LeaseTemplateButton";

export interface LeaseDisclosure {
  advertisementOverview: {
    vehicleModel: string;
    advertisedMonthlyPayment: string;
    advertisedDownPayment: string;
    isTransparent: boolean;
  };
  finePrintSummary: {
    actuallyDueAtSigning: string;
    difference: string;
    monthlyPaymentDetail: string;
    originalDisclosure: string;
    includedFeesInAdvertised: string[];
  };
  fullPaymentDetails: {
    paymentDetails: {
      monthlyPayment: string;
      downPayment: string;
      firstMonthPayment: string;
      leaseTerm: string;
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
      mileageLimit: string;
    };
  };
}

interface LeaseDisclosureCardProps {
  disclosure: LeaseDisclosure;
}

const LeaseDisclosureCard: React.FC<LeaseDisclosureCardProps> = ({ disclosure }) => {
  // Calculate if the ad is actually transparent by checking if fees are mentioned separately
  

  const {
    advertisementOverview: { advertisedDownPayment },
  } = disclosure;


  // Calculate the monthly payment with tax
  const monthlyWithTax = (() => {
    const baseAmount = Number(disclosure.advertisementOverview.advertisedMonthlyPayment.replace(/[^0-9.-]+/g, ''));
    const withTax = baseAmount * 1.07;
    return withTax.toFixed(0);
  })();

  // Calculate total due at signing including first month's payment and all fees
  const totalDueAtSigning = (() => {
    const downPayment = Number(disclosure.fullPaymentDetails.paymentDetails.downPayment.replace(/[^0-9.-]+/g, '')); 
    const firstMonth = Number(disclosure.fullPaymentDetails.paymentDetails.firstMonthPayment.replace(/[^0-9.-]+/g, '')); 

    if (disclosure.advertisementOverview.isTransparent) {
      // For transparent ads, only include down payment and first month
      const total = downPayment + firstMonth;
      return `$${total.toLocaleString()}`;
    }

    // For non-transparent ads, include all fees
    const bankFee = Number(disclosure.fullPaymentDetails.additionalFees.bankAcquisitionFee.replace(/[^0-9.-]+/g, '')); 
    const dealerFee = Number(disclosure.fullPaymentDetails.additionalFees.dealerFee.replace(/[^0-9.-]+/g, '')); 
    const tagFees = Number(disclosure.fullPaymentDetails.additionalFees.tagFees.replace(/[^0-9.-]+/g, '')); 
    const electronicFee = Number(disclosure.fullPaymentDetails.additionalFees.electronicFee.replace(/[^0-9.-]+/g, '')); 

    const total = downPayment + firstMonth + bankFee + dealerFee + tagFees + electronicFee;
    return `$${total.toLocaleString()}`;
  })();

  // Calculate the difference between advertised and actual amount
  const calculateDifference = () => {
    if (disclosure.advertisementOverview.isTransparent) {
      return ''; // No difference for transparent ads
    }

    const advertised = Number(advertisedDownPayment.replace(/[^0-9.-]+/g, '')); 
    const downPayment = Number(disclosure.fullPaymentDetails.paymentDetails.downPayment.replace(/[^0-9.-]+/g, '')); 
    const firstMonth = Number(disclosure.fullPaymentDetails.paymentDetails.firstMonthPayment.replace(/[^0-9.-]+/g, '')); 
    const bankFee = Number(disclosure.fullPaymentDetails.additionalFees.bankAcquisitionFee.replace(/[^0-9.-]+/g, '')); 
    const dealerFee = Number(disclosure.fullPaymentDetails.additionalFees.dealerFee.replace(/[^0-9.-]+/g, '')); 
    const tagFees = Number(disclosure.fullPaymentDetails.additionalFees.tagFees.replace(/[^0-9.-]+/g, '')); 
    const electronicFee = Number(disclosure.fullPaymentDetails.additionalFees.electronicFee.replace(/[^0-9.-]+/g, '')); 

    const totalActual = downPayment + firstMonth + bankFee + dealerFee + tagFees + electronicFee;
    const difference = totalActual - advertised;
    
    return difference > 0 ? `$${difference.toLocaleString()} more than advertised` : '';
  };

  const difference = calculateDifference();

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] rounded-[24px] border-gray-100 mb-8">
      <CardHeader className="px-8 pt-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold">
            {disclosure.advertisementOverview.vehicleModel}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="space-y-8">
          {/* Advertisement Section */}
          <div className="rounded-2xl bg-[rgb(240,245,255)] p-8">
            <h3 className="font-semibold text-xl text-gray-900 mb-4">Advertisement Shows</h3>
            <div className="space-y-2">
              <p className="text-xl font-medium">
                {disclosure.advertisementOverview.advertisedMonthlyPayment} per month
              </p>
              <p className="text-xl text-gray-600">
                {disclosure.advertisementOverview.advertisedDownPayment} down payment
              </p>
            </div>
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="fine-print" className="border-t border-gray-200">
                <AccordionTrigger className="text-base text-gray-600 hover:text-gray-900 group">
                  <span className="flex items-center">
                    <Search className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-600" />
                    View The Fine Print
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-lg">
                    {disclosure.finePrintSummary.originalDisclosure}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Payment & Fine Print Section */}
          <div className="rounded-2xl bg-white border-2 border-red-100 p-8">
            <div>
              <div className="flex items-start gap-4 mb-4">
                <AlertTriangle className={`w-6 h-6 ${disclosure.advertisementOverview.isTransparent ? 'text-green-500' : 'text-red-500'} flex-shrink-0`} />
                <h3 className="font-semibold text-2xl text-gray-900">
                  {disclosure.advertisementOverview.isTransparent ? 'Transparent Advertisement' : 'The Real Price'}
                </h3>
              </div>
              <div className="space-y-2">
                <p className={`text-2xl font-bold ${disclosure.advertisementOverview.isTransparent ? 'text-green-500' : 'text-red-500'}`}>
                  ${monthlyWithTax}/Month <span className="text-gray-900 text-lg">(w/ tax)</span>
                </p>
                <p className={`text-2xl font-bold ${disclosure.advertisementOverview.isTransparent ? 'text-green-500' : 'text-red-500'}`}>
                  {totalDueAtSigning} <span className="text-gray-900 text-lg">due at signing</span>
                </p>
                {difference && (
                  <p className="text-gray-500 font-bold text-lg">
                    {difference}!
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 ">
              <h4 className="font-semibold text-xl mb-4">Full Details</h4>
              <div className="grid gap-4">
                {/* Due At Signing Details */}
                <div className="rounded-xl py-4 ">
                  <h5 className="font-medium mb-3">Due At Signing Details</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Down Payment</span>
                      <span className="font-medium">
                        {disclosure.fullPaymentDetails.paymentDetails.downPayment}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>First Month Payment</span>
                      <span className="font-medium">
                        {disclosure.fullPaymentDetails.paymentDetails.firstMonthPayment}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Additional Fees */}
                {!disclosure.advertisementOverview.isTransparent && (
                  <div className="rounded-xl py-4 ">
                    <h5 className="font-medium mb-3">+ Additional Fees</h5>
                    <ul className="space-y-2.5 text-gray-700">
                      <li className="flex justify-between">
                        <span>Bank Acquisition Fee</span>
                        <span className="font-medium">
                          {disclosure.fullPaymentDetails.additionalFees.bankAcquisitionFee}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Dealer Fee</span>
                        <span className="font-medium">
                          {disclosure.fullPaymentDetails.additionalFees.dealerFee}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Tag Fees</span>
                        <span className="font-medium">
                          {disclosure.fullPaymentDetails.additionalFees.tagFees}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Electronic Fee</span>
                        <span className="font-medium">
                          {disclosure.fullPaymentDetails.additionalFees.electronicFee}
                        </span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Required Discounts */}
                <div className="rounded-xl py-4 ">
                  <h5 className="font-medium mb-3">Required Stipulations</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Volvo Loyalty</span>
                      <span className="font-medium">
                        {disclosure.fullPaymentDetails.requiredDiscounts.volvoLoyalty}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Affinity/A-plan</span>
                      <span className="font-medium">
                        {disclosure.fullPaymentDetails.requiredDiscounts.affinityAplan}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>FWD to AWD Allowance</span>
                      <span className="font-medium">
                        {disclosure.fullPaymentDetails.requiredDiscounts.fwdToAwdAllowance}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Vehicle Requirements */}
                <div className="rounded-xl py-4">
                  <h5 className="font-medium mb-3">Vehicle Requirements</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Model</span>
                      <span className="font-medium">
                        {disclosure.fullPaymentDetails.vehicleRequirements.model}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>MSRP</span>
                      <span className="font-medium">
                        {disclosure.fullPaymentDetails.vehicleRequirements.msrp}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Annual Mileage Limit</span>
                      <span className="font-medium">
                        {disclosure.fullPaymentDetails.vehicleRequirements.mileageLimit}
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <span className="font-medium">Note:</span> Vehicles featured in the advertisements are often not available. They may have been sold, could be loaner vehicles, or otherwise unavailable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Move the button to the bottom */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <LeaseTemplateButton disclosure={disclosure} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaseDisclosureCard;
