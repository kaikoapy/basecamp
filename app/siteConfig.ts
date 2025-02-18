export const siteConfig = {
  name: "Dashboard",
  url: "https://dealerbasecamp.com",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    home: "/",
    overview: "/overview",
    details: "/details",
    settings: {
      general: "/settings/general",
      billing: "/settings/billing",
      users: "/settings/users",
      reports: "/settings/reports",
    },
  },
}

export type siteConfig = typeof siteConfig
