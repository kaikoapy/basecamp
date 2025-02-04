import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertTriangle, Search } from "lucide-react"

interface AdComparisonCardProps {
  ad: {
    model: string
    originalAd: {
      monthlyPayment: string
      downPayment: string
      details: string
    }
    actualMeaning: {
      monthlyPayment: string
      dueAtSigning: string
      details: string[]
    }
  }
}

export default function AdComparisonCard({ ad }: AdComparisonCardProps) {
  const downPaymentValue = Number.parseInt(ad.originalAd.downPayment.replace(/[^0-9]/g, ""))
  const dueAtSigningValue = Number.parseInt(ad.actualMeaning.dueAtSigning.replace(/[^0-9]/g, ""))
  const difference = dueAtSigningValue - downPaymentValue

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] rounded-[24px] border-gray-100">
      <CardHeader className="px-8 pt-8">
        <CardTitle className="text-3xl font-bold">{ad.model}</CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="space-y-8">
          <div className="rounded-2xl bg-[rgb(240,245,255)] p-8">
            <h3 className="font-semibold text-2xl text-gray-900 mb-4">Advertisement Shows</h3>
            <div className="space-y-2">
              <p className="text-2xl font-medium">{ad.originalAd.monthlyPayment}</p>
              <p className="text-xl text-gray-600">{ad.originalAd.downPayment}</p>
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
                    {ad.originalAd.details}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="rounded-2xl bg-white border-2 border-red-100 p-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-2xl text-gray-900">Actually Due at Signing</h3>
                <p className="text-4xl font-bold text-red-500 mt-4">{ad.actualMeaning.dueAtSigning}</p>
                <p className="text-red-500 font-medium text-lg mt-2">
                  {difference > 0 &&
                    `${difference.toLocaleString("en-US", { style: "currency", currency: "USD" })} more than advertised`}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xl text-gray-900">{ad.actualMeaning.monthlyPayment}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-semibold text-xl mb-4">Full Details</h4>
              <div className="grid gap-4">
                <div className="rounded-xl py-4 border-b border-gray-200 last:border-b-0">
                  <h5 className="font-medium mb-3">Payment Details</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Monthly Payment</span>
                      <span className="font-medium">{ad.actualMeaning.monthlyPayment}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Down Payment</span>
                      <span className="font-medium">{ad.originalAd.downPayment}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>First Month Payment</span>
                      <span className="font-medium">${ad.actualMeaning.details[6].split("$")[1]}</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl py-4 border-b border-gray-200 last:border-b-0">
                  <h5 className="font-medium mb-3">Additional Fees</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Bank Acquisition Fee</span>
                      <span className="font-medium">$995</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dealer Fee</span>
                      <span className="font-medium">$999</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tag Fees</span>
                      <span className="font-medium">$250</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Electronic Fee</span>
                      <span className="font-medium">$399</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl py-4 border-b border-gray-200 last:border-b-0">
                  <h5 className="font-medium mb-3">Required Discounts</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Volvo Loyalty</span>
                      <span className="font-medium">$1,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Affinity/A-plan</span>
                      <span className="font-medium">$500</span>
                    </li>
                    <li className="flex justify-between">
                      <span>FWD to AWD Allowance</span>
                      <span className="font-medium">$1,000</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl py-4 border-b border-gray-200 last:border-b-0">
                  <h5 className="font-medium mb-3">Vehicle Requirements</h5>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex justify-between">
                      <span>Model</span>
                      <span className="font-medium">{ad.model} specifically</span>
                    </li>
                    <li className="flex justify-between">
                      <span>MSRP</span>
                      <span className="font-medium">${ad.actualMeaning.details[2].split("$")[1].split(" ")[0]}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

