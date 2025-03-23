"use client";

import { siteConfig } from "@/app/siteConfig";
import useScroll from "../lib/use-scroll";
import { cn } from "@/lib/utils";
import { RiCloseLine, RiMenuLine, RiTaskLine } from "@remixicon/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "./Button";
import { useUser } from "@clerk/nextjs";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const features = [
  {
    title: "View All Features",
    href: "/features",
    description: "Explore our comprehensive suite of dealership tools. From dashboard to training, everything you need in one place.",
    colSpan: 2
  },
  {
    title: "Dashboard",
    href: "/features#dashboard",
    description: "Quick access to frequently used templates with organized, relevant content and important announcements.",
  },
  {
    title: "Resources",
    href: "/features#resources",
    description: "Essential tools including gas calculator, out-of-state guides, and dealer trade information.",
  },
  {
    title: "Directory",
    href: "/features#directory",
    description: "Comprehensive staff listings with powerful search that recognizes both formal names and nicknames.",
  },
  {
    title: "Schedule",
    href: "/features#schedule",
    description: "Create, edit and print schedules with flexible publishing controls and sensitive information protection.",
  },
  {
    title: "Product Training",
    href: "/features#product-training",
    description: "Stay current with latest Volvo product knowledge through regularly updated materials and customer FAQs.",
  }
];

const resources = [
  {
    title: "About Us",
    href: "/resources",
    description: "Learn how to maximize your Volvo sales team's efficiency with our comprehensive guides.",
  },
  {
    title: "Are we a good fit?",
    href: "/resources",
    description: "Join our network of Volvo dealerships and share sales strategies and best practices.",
  },
  {
    title: "FAQ",
    href: "/resources",
    description: "Find quick answers to common questions about using Basecamp in your dealership.",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
});
ListItem.displayName = "ListItem";

export function Navigation() {
  const scrolled = useScroll(15);
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();

  React.useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(min-width: 768px)");
    const handleMediaQueryChange = () => {
      setOpen(false);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange();

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <header
      className={cn(
        "animate-slide-down-fade fixed inset-x-3 top-4 z-50 mx-auto flex max-w-6xl transform-gpu justify-center rounded-xl border border-transparent px-3 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
        open === true ? "h-52" : "h-16",
        scrolled || open === true
          ? "backdrop-blur-nav max-w-3xl border-gray-100 bg-white/80 shadow-xl shadow-black/5 dark:border-white/15 dark:bg-black/70"
          : "bg-white/0 dark:bg-gray-950/0",
      )}
    >
      <div className="w-full md:my-auto ">
        <div className="relative flex items-center justify-between">
          <Link href="/" aria-label="Home" className="-mt-2">
            <Image
              src="/Basecamp-logo.png"
              alt="Basecamp Logo"
              width={320}
              height={320}
              quality={100}
              priority
              className="w-28 md:w-40 dark:invert"
              style={{ objectFit: 'contain' }}
            />
          </Link>

          <div className="flex-1 flex justify-center ">
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      {features.map((feature) => (
                        <ListItem
                          key={feature.title}
                          title={feature.title}
                          href={feature.href}
                          className={feature.colSpan ? "col-span-2" : ""}
                        >
                          {feature.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/resources"
                            prefetch={true}
                          >
                            <RiTaskLine className="h-6 w-6 text-primary" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              All Resources
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Access comprehensive guides, FAQs, and best practices to help your dealership succeed.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {resources.map((resource) => (
                        <ListItem
                          key={resource.title}
                          title={resource.title}
                          href={resource.href}
                        >
                          {resource.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href={siteConfig.baseLinks.pricing} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-accent active:bg-accent/80"
                    )}>
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {user ? (
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/dashboard">
                <Button variant="primary" className="inline-flex h-10 cursor-pointer items-center justify-center gap-1 rounded-xl border-b-[1.5px] border-[#5553d4] bg-gradient-to-b from-[#6a68f1] to-[#5553d4] px-5 py-3 font-medium tracking-wide text-white shadow-[0_0_0_2px_rgba(0,0,0,0.04),0_0_14px_0_rgba(106,104,241,0.19)] transition-all duration-200 ease-in-out hover:shadow-[#6a68f1]/30 active:scale-[0.98]">
                  Open Basecamp
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/sign-in">
                <Button variant="ghost" className="h-10 font-medium">
                  Sign in
                </Button>
              </Link>
              <Link href="/about">
              <Button className="inline-flex h-10 cursor-pointer items-center justify-center gap-1 rounded-xl border-b-[1.5px] border-[#5553d4] bg-gradient-to-b from-[#6a68f1] to-[#5553d4] px-5 py-3 font-medium tracking-wide text-white shadow-[0_0_0_2px_rgba(0,0,0,0.04),0_0_14px_0_rgba(106,104,241,0.19)] transition-all duration-200 ease-in-out hover:shadow-[#6a68f1]/30 active:scale-[0.98]">
                  Request Access
                </Button>
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-700 md:hidden"
          >
            {open ? (
              <RiCloseLine className="size-6" />
            ) : (
              <RiMenuLine className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="mt-4 space-y-4 md:hidden">
            <div className="space-y-2">
              <div className="font-medium px-3">Features</div>
              {features.map((feature) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {feature.title}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <div className="font-medium px-3">Resources</div>
              {resources.map((resource) => (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {resource.title}
                </Link>
              ))}
            </div>
            <Link
              href={siteConfig.baseLinks.pricing}
              className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800"
            >
              Pricing
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}