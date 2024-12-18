export interface Department {
  name: string;
  hours: string;
  phone: string;
}

export interface DealerInfo {
  name: string;
  address: string;
  googleMapsUrl: string;
  departments: Department[];
}

export const dealerInfo: DealerInfo = {
  name: "Volvo Cars North Miami",
  address: "20800 NW 2nd Ave, Miami, FL 33169",
  googleMapsUrl: "https://maps.google.com/?q=Volvo+Cars+North+Miami",
  departments: [
    {
      name: "Sales",
      hours: "Mon-Thurs: 9AM-8PM\nFri: 9AM-7PM\nSat: 9AM-7PM\nSun: 12PM-5PM",
      phone: "786-393-6506",
    },
    {
      name: "Service",
      hours: "Mon-Fri: 7:30AM-6PM\nSat: 8AM-5PM\nSun: Closed",
      phone: "786-629-5626",
    },
    {
      name: "Parts",
      hours: "Mon-Fri: 7:30AM-6PM\nSat-Sun: Closed",
      phone: "786-629-5610",
    },
  ],
};
