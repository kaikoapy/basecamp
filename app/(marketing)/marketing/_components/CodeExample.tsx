import Code from "./Code"
import {
  RiLinksLine,
  RiPlugLine,
  RiShieldKeyholeLine,
  RiStackLine,
} from "@remixicon/react"
import { Badge } from "./Badge"
import CodeExampleTabs from "./CodeExampleTabs"

// Dashboard example (replacing SQL code)
const dashboardExample = `# Volvo Sales Dashboard

## Quick Access Links
- Volvo Portal
- Inventory Management
- Carfax Reports
- Financing Calculator
- Customer Database
- Service Scheduling

## Today's Appointments
- 9:00 AM - Test Drive: 2024 XC90 (John Smith)
- 11:30 AM - Delivery: 2023 S60 (Susan Johnson)
- 2:00 PM - Sales Consultation (Michael Williams)
- 4:30 PM - Trade-in Appraisal (David Brown)

## Inventory Highlights
- XC90 Recharge - 3 units (1 sold this week)
- XC60 - 5 units (3 sold this week)
- S90 - 2 units (new arrival)
- V60 Cross Country - 1 unit (reserved)

## Team Announcements
- New incentives for 2024 models - See details
- Monthly sales meeting - Tomorrow, 8:30 AM
- Product training: EX90 features - Friday, 2:00 PM`

// Feature comparison (replacing JavaScript code)
const featureComparison = `# Volvo Basecamp Plan Comparison

## Single Agent Plan
- Personal dashboard with customizable bookmarks
- Basic Volvo product specifications
- Standard Carfax lookup
- Email support (48-hour response)

## Sales Team Plan
- Team sharing and collaboration tools
- Advanced Volvo resources and competitive comparisons
- Integrated inventory system access
- Calendar and appointment scheduling
- Email and chat support (24-hour response)
- Group training session

## Dealership Pro Plan
- Unlimited user accounts
- Complete Volvo documentation library
- Premium Carfax integration
- Advanced calendar with team coordination
- Sales performance analytics and reporting
- Custom dashboards for managers
- Dedicated support agent with priority response
- Personalized training sessions`

const features = [
  {
    name: "Works with Your Sales Stack",
    description:
      "Basecamp links seamlessly to the tools your Volvo dealership team relies on, like Carfax and inventory sites.",
    icon: RiStackLine, // Represents a stack of tools/resources
  },
  {
    name: "Plug-and-Play Simplicity",
    description:
      "Customize Basecamp to fit your team—add tool links, tweak layouts, or update resources right from the dashboard.",
    icon: RiPlugLine, // Stays relevant for plug-and-play ease
  },
  {
    name: "Pre-Built Connections",
    description:
      "Sync Basecamp with your dealership's platforms, from CRM and Volvo portals to Slack and email—all in one hub.",
    icon: RiLinksLine, // Perfect for connections/links
  },
  {
    name: "Secure and Reliable",
    description:
      "Keep your team's schedules and links safe with top-tier encryption and access controls you can trust.",
    icon: RiShieldKeyholeLine, // Still works for security
  },
];

export default function CodeExample() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>Sales-first</Badge>
      <h2
        id="code-example-title"
        className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
      >
        Built for Volvo dealerships, <br /> for sales teams
      </h2>
      <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
        Everything your sales team needs in one place - from inventory tracking to Volvo resources, 
        all tailored to streamline your dealership&apos;s workflow and boost performance.
      </p>
      <CodeExampleTabs
        tab1={
          <Code code={dashboardExample} lang="markdown" copy={false} className="h-[31rem]" />
        }
        tab2={
          <Code
            code={featureComparison}
            lang="markdown"
            copy={false}
            className="h-[31rem]"
          />
        }
      />
      <dl className="mt-24 grid grid-cols-4 gap-10">
        {features.map((item) => (
          <div
            key={item.name}
            className="col-span-full sm:col-span-2 lg:col-span-1"
          >
            <div className="w-fit rounded-lg p-2 shadow-md shadow-indigo-400/30 ring-1 ring-black/5 dark:shadow-indigo-600/30 dark:ring-white/5">
              <item.icon
                aria-hidden="true"
                className="size-6 text-indigo-600 dark:text-indigo-400"
              />
            </div>
            <dt className="mt-6 font-semibold text-gray-900 dark:text-gray-50">
              {item.name}
            </dt>
            <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
              {item.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}