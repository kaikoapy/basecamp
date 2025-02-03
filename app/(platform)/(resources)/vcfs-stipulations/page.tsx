"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FinancialStipulations() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-primary mb-6">Volvo Car Financial Stipulations</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Proof of Residency (POR)</CardTitle>
          <CardDescription>
            Required when a customer&apos;s address does not match the primary address on the credit bureau or if there is an
            address discrepancy, unless the credit underwriter can verify the address through alternative sources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="current-utility-bill">
              <AccordionTrigger>Current Utility Bill</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6">
                  <li>Must include service address (city, state, zip) matching the contract.</li>
                  <li>
                    Cellphone bills are not acceptable as standalone documents but can be included if part of a
                    cable/home internet package.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="current-mortgage-document">
              <AccordionTrigger>Current Mortgage Document</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6">
                  <li>Includes mortgage statements or property tax bills.</li>
                  <li>
                    Mortgage closure disclosure/settlement statement dated within 30 days of the application is
                    acceptable.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="current-pay-stub">
              <AccordionTrigger>Current Pay Stub</AccordionTrigger>
              <AccordionContent>
                <p>Current pay stub is an acceptable form of proof of residency.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="current-bank-statement">
              <AccordionTrigger>Current Bank Deposit Account Statement</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6">
                  <li>
                    Includes checking, savings, CDs, investments, money market statements, and retirement accounts.
                  </li>
                  <li>Credit card statements are not acceptable.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="active-documents">
              <AccordionTrigger>Active Documents</AccordionTrigger>
              <AccordionContent>
                <p>Must be in effect at the time of application:</p>
                <ul className="list-disc pl-6">
                  <li>
                    Current motor vehicle proof of insurance (not for the vehicle on the current retailer credit
                    application).
                  </li>
                  <li>
                    Current rental agreement (must be on official letterhead, dated, signed, and countersigned, with
                    proof of rent payment).
                  </li>
                  <li>
                    Military orders indicating residence (end date must be at least 60 days after the application date).
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Proof of Income (POI)</CardTitle>
          <CardDescription>
            May be required as a condition of credit approval, especially if there are multiple credit applications with
            differing income or if income is not clearly identified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="current-ytd-pay-stub">
              <AccordionTrigger>Current YTD Pay Stub</AccordionTrigger>
              <AccordionContent>
                <p>Dated no more than 45 days prior to the application date.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="previous-year-tax-return">
              <AccordionTrigger>Previous Year&apos;s Federal Income Tax Return</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6">
                  <li>Must be complete with all schedules and no redactions.</li>
                  <li>
                    If past the tax deadline, a current year filed extension with the prior year&apos;s tax return is
                    acceptable.
                  </li>
                  <li>
                    Business tax returns and K-1 forms should be included for any businesses listed on Schedule E of the
                    personal tax return.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="w-2">
              <AccordionTrigger>W-2 (if applicable)</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6">
                  <li>Prior year W-2 is acceptable until March 31 of the current year.</li>
                  <li>After March 31, it must be accompanied by a current YTD pay stub.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="1099-statement">
              <AccordionTrigger>1099 Statement (if applicable)</AccordionTrigger>
              <AccordionContent>
                <p>1099-S, 1099-NEC, and 1099-MESC are not acceptable.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: Applicant bank statements are not acceptable as POI. Spousal income is not considered unless included
            in a joint application.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Proof of Social Security Number (SSN)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>SSN Card</li>
            <li>
              Current YTD Pay Stub (must include full SSN and be dated no more than 45 days prior to the application
              date)
            </li>
            <li>Most Recent Valid W-2</li>
            <li>Previous Year&apos;s Federal Income Tax Return (must be complete with all schedules and no redactions)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Proof of Name (PON)</CardTitle>
          <CardDescription>
            May be required if the customer&apos;s name does not match the credit bureau. Documents must match the name as
            captured on the contract.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Marriage License</li>
            <li>Divorce Decree</li>
            <li>Completed Court Order for Name Change</li>
            <li>Adoption Decree</li>
            <li>Birth Certificate (both US and non-US issued are acceptable)</li>
            <li>Customer Identification Verification (CIV) Form</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Proof of Date of Birth (PODOB)</CardTitle>
          <CardDescription>
            Documents must match the client&apos;s name and date of birth as captured on the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Birth Certificate (both US and non-US issued are acceptable)</li>
            <li>Adoption Decree (with DOB)</li>
            <li>Customer Identification Verification (CIV) Form</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

