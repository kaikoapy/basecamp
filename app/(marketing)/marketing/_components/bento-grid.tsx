import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Marquee } from "./magicui/marquee";
import { AnimatedList } from "./magicui/animated-list";
import { AnimatedBeamMultipleOutputDemo } from "./animated-beam-multiple-outputs";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const files = [
  {
    name: "wire-instructions.pdf",
    body: "Monthly sales performance report showing revenue growth and customer acquisition metrics.",
  },
  {
    name: "Credit-Application.pdf",
    body: "Current vehicle inventory status with detailed specifications and availability.",
  },
  {
    name: "2025.5-XC90-brochure.pdf",
    body: "Customer database with contact information and purchase history.",
  },
  {
    name: "business-application.pdf",
    body: "Strategic marketing plan for upcoming vehicle launches and promotions.",
  },
  {
    name: "out-of-state-reciprocity.pdf",
    body: "Quarterly financial report with revenue projections and cost analysis.",
  },
];

const notifications = [
  { 
    id: 1, 
    subject: "2025 XC90 Weekend Push - $1000 Spiffs",
    to: "Sales Team",
    from: "General Manager",
    preview: "Team, To push our remaining 2024 XC90s, we're doubling spiffs this weekend. We have 15 XC90s still on the lot that we need to move...",
  },
  { 
    id: 2, 
    subject: "Monthly Sales Update - Great Numbers!",
    to: "Sales Team",
    from: "Sales Manager",
    preview: "Team, Outstanding month so far! Current standings: Gio (22 units), Tito (18), Alex (15), Juan (14). Keep pushing for those year-end bonuses...",
  },
  { 
    id: 3, 
    subject: "Mandatory Sales Meeting - February Results",
    to: "Sales Team",
    from: "General Manager",
    preview: "Team, February was a F***ing disaster at 42 units vs our 75 unit goal. Sweden's so ashamed, they're holding a nationwide silence to grieve our failure. Mandatory meeting tomorrow 8:30am. No excuses for missing this one...",
  }
];

const features = [
  {
    Icon: FileTextIcon,
    name: "Document Management",
    description: "Access and manage all your dealership documents in one place.",
    href: "#",
    cta: "View Documents",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: BellIcon,
    name: "Post Store Communications",
    description: "Keep your team informed by posting your latest announcements and updates with our email-synced communication tool.",
    href: "#",
    cta: "View Notifications",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedList delay={4000} className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex w-full flex-col gap-1 rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">{item.subject}</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex gap-2 text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">To:</span>
                <span className="text-gray-600 dark:text-gray-400">{item.to}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">From:</span>
                <span className="text-gray-600 dark:text-gray-400">{item.from}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500 line-clamp-2">{item.preview}</p>
            </div>
          </div>
        ))}
      </AnimatedList>
    ),
  },
  {
    Icon: Share2Icon,
    name: "Resource Hub",
    description: "Organize and link all the tools your sales team uses in one place.",
    href: "#",
    cta: "Explore Integrations",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_45%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: CalendarIcon,
    name: "Schedule Builder",
    description: "Build, manage, print, and share your sales schedule with ease.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "View Calendar",
    background: (
      <Calendar
        mode="single"
        selected={new Date()}
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
      />
    ),
  },
];

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
        {name}
      </h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export function BentoDemo() {
  return (
    <div className="py-12">
      <BentoGrid>
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}

export { BentoCard, BentoGrid };
