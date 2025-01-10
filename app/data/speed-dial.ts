interface Contact {
  name: string;
  phone: string;
  title?: string;
}

interface ExternalContact {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface SpeedDialContacts {
  management: Contact[];
  porters: Contact[];
  salespeople: Contact[];
  deliverySpecialists: Contact[];
  external: {
    vfs: ExternalContact;
    aPlan: ExternalContact;
    costco: ExternalContact;
  };
}

export const speedDialContacts: SpeedDialContacts = {
  management: [
    {
      name: "Serdar",
      phone: "(954) 478-0068",
    },
    {
      name: "Marlon (also a manager)",
      phone: "(305) 495-6700",
    },
    {
      name: "Cesar",
      phone: "(305) 333-9525",
    },
  ],
  porters: [
    { name: "Andres", phone: "(786) 449-5934" },
    { name: "Jaramio", phone: "(786) 413-4991" },
    { name: "Ramon", phone: "(754) 368-6895" },
  ],
  salespeople: [
    { name: "Ron", phone: "(239) 565-6765" },
    { name: "Juan", phone: "(305) 705-5822" }, // Goto
    { name: "Moudy", phone: "(786) 271-7515" },
    { name: "Kai", phone: "(786) 305-5161" },
    { name: "Gio", phone: "(786) 444-8322" },
    { name: "Amr", phone: "(305)690-6038" }, // Goto
    { name: "Tito", phone: "(973) 420-9482" },
    { name: "Alex", phone: "(305) 586-6687" },
    { name: "Gabriel", phone: "(954) 995-4180" },
  ],
  deliverySpecialists: [
    { name: "Nicolas Meek", phone: "(305) 907-6871" },
    { name: "Josh Sadov", phone: "(305) 690-6116" },
  ],
  external: {
    vfs: {
      name: "Volvo Financial Services",
      address:
        "Volvo Car Financial Services\nPO Box 91300\nMobile, AL 36691-1300",
      phone: "1-866-499-6793",
    },
    aPlan: {
      name: "A-Plan",
      email: "Support@aplanbyvolvo.com",
    },
    costco: {
      name: "Costco Auto Program",
      phone: "1-800-755-2519",
    },
  },
};
