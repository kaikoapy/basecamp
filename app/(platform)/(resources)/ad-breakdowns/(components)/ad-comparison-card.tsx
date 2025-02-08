import LeaseDisclosureCard, { LeaseDisclosure } from "./LeaseDisclosureCard"

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
  // Transform the existing ad data into the new LeaseDisclosure format
  const leaseDisclosure: LeaseDisclosure = {
    advertisementOverview: {
      vehicleModel: ad.model,
      advertisedMonthlyPayment: ad.originalAd.monthlyPayment,
      advertisedDownPayment: ad.originalAd.downPayment,
      isTransparent: false
    },
    finePrintSummary: {
      actuallyDueAtSigning: ad.actualMeaning.dueAtSigning,
      difference: "",
      monthlyPaymentDetail: ad.actualMeaning.monthlyPayment,
      originalDisclosure: ad.originalAd.details,
      includedFeesInAdvertised: []
    },
    fullPaymentDetails: {
      paymentDetails: {
        monthlyPayment: ad.actualMeaning.monthlyPayment,
        downPayment: ad.originalAd.downPayment,
        firstMonthPayment: `$${ad.actualMeaning.details[6].split("$")[1]}`,
        leaseTerm: "36 months"
      },
      additionalFees: {
        bankAcquisitionFee: "$995",
        dealerFee: "$999",
        tagFees: "$250",
        electronicFee: "$399"
      },
      requiredDiscounts: {
        volvoLoyalty: "$1,000",
        affinityAplan: "$500",
        fwdToAwdAllowance: "$1,000"
      },
      vehicleRequirements: {
        model: ad.model,
        msrp: `$${ad.actualMeaning.details[2].split("$")[1].split(" ")[0]}`,
        mileageLimit: "7,500 miles per year"
      }
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="w-full">
        <LeaseDisclosureCard disclosure={leaseDisclosure} />
      </div>
      <div className="w-full">
        {/* Add your copy response template here */}
      </div>
    </div>
  )
}

