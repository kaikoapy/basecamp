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
    roadside: ExternalContact;
  };
}

export const speedDialContacts: SpeedDialContacts = {
  management: [
    {
      name: "Serdar",
      phone: "(954) 478-0068",
    },
    {
      name: "Marlon",
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
    { name: "Juan", phone: "(305) 705-5822" }, 
    { name: "Kai", phone: "(786) 305-5161" },
    { name: "Gio", phone: "(786) 444-8322" },
    { name: "Amr", phone: "(305) 690-6038" },
    { name: "Tito", phone: "(973) 420-9482" },
    { name: "Alex", phone: "(305) 586-6687" },
    { name: "Gabriel", phone: "(954) 995-4180" },
    { name: "Steven", phone: "(310) 621-2905" },
  ],
  deliverySpecialists: [
    { name: "Daniel Arregoitia", phone: "(305) 690-6116" },
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
    roadside: {
      name: "Roadside Assistance",
      phone: "1-800-222-4357",
    },
    costco: {
      name: "Costco Auto Program",
      phone: "1-800-755-2519",
    },
  },
};
