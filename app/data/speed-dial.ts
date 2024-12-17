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
  productSpecialists: Contact[];
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
      title: "New Car Sales Manager",
      phone: "(555) 123-4567",
    },
    {
      name: "Marlon",
      title: "also a manager",
      phone: "(555) 123-4568",
    },
    {
      name: "Cesar",
      title: "Service Manager",
      phone: "(555) 123-4568",
    },
  ],
  porters: [
    { name: "Andres", phone: "(555) 123-4569" },
    { name: "Jaramio", phone: "(555) 123-4570" },
    { name: "Ramon", phone: "(555) 123-4571" },
  ],
  salespeople: [
    { name: "Ron", phone: "(555) 123-4572" },
    { name: "Juan", phone: "(555) 123-4573" },
    { name: "Moudy", phone: "(555) 123-4574" },
    { name: "Kai", phone: "(555) 123-4575" },
    { name: "Gio", phone: "(555) 123-4576" },
    { name: "Amr", phone: "(555) 123-4577" },
    { name: "Tito", phone: "(555) 123-4578" },
    { name: "Alex", phone: "(555) 123-4579" },
    { name: "Gabriel", phone: "(555) 123-4580" },
  ],
  productSpecialists: [
    { name: "Josh", phone: "(555) 123-4581" },
    { name: "Nick", phone: "(555) 123-4582" },
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
