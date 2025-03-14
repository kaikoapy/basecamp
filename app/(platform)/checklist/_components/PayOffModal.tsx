import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info } from "lucide-react";

interface PayOffModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const PayOffModal: React.FC<PayOffModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle>Pay Off Numbers</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <div className="overflow-auto mt-4">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b-2 border-gray-300">
                    Automaker/Financer
                  </th>
                  <th className="px-4 py-2 border-b-2 border-gray-300">
                    Phone Number
                  </th>
                  <th className="px-4 py-2 border-b-2 border-gray-300">
                    3rd Party Lease Buyout
                  </th>
                </tr>
              </thead>
              <tbody>
                {payOffData.map((item, index) => (
                  <tr key={index} className="text-left text-sm">
                    <td className="pl-4 py-2 border-b">
                      {item.automaker}
                    </td>
                    <td className="pl-4 py-2 border-b">{item.phone}</td>
                    <td className="pl-4 py-2 border-b">
                      {item.buyout}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✅ - Third-party lease buyouts allowed
            <br />
            ❌ - Third-party lease buyouts not allowed
            <br /> <br />
            <Info className="inline-block mr-2 h-4 w-4" />
            Always call each institution yourself to confirm if 3rd
            party lease buyouts are allowed. This is solely a guide that
            provides you with all the phone numbers in one place and the
            response I received this month. If there are only a few
            remaining payments, we may be able to compensate the
            customer for those payments without buying the lease. Or
            managers may have a loophole to buy out leases. Don&apos;t rule
            anything out.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayOffModal;
