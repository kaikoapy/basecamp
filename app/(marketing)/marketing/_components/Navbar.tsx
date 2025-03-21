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
    title: "Task Management",
    href: "/features/tasks",
    description: "Organize and track your team's work with powerful task management tools.",
  },
  {
    title: "Team Collaboration",
    href: "/features/collaboration",
    description: "Work together seamlessly with real-time collaboration features.",
  },
  {
    title: "File Sharing",
    href: "/features/files",
    description: "Share and organize files with your team in one central location.",
  },
];

const resources = [
  {
    title: "Documentation",
    href: "/docs",
    description: "Learn how to use Basecamp effectively with our comprehensive guides.",
  },
  {
    title: "API Reference",
    href: "/docs/api",
    description: "Integrate Basecamp with your tools using our robust API.",
  },
  {
    title: "Community",
    href: "/community",
    description: "Join our community of users and share best practices.",
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
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href={siteConfig.baseLinks.home} aria-label="Home" prefetch={true}>
            <span className="sr-only">Company logo</span>
            <Image
              src="/Basecamp.Logo.svg"
              alt="Basecamp Logo"
              width={160}
              height={40}
              className="w-28 md:w-40 dark:invert"
              priority
            />
          </Link>

          <NavigationMenu className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/features"
                          prefetch={true}
                        >
                          <RiTaskLine className="h-6 w-6 text-primary" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Project Management
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Streamline your workflow with powerful project management tools. 
                            Track tasks, collaborate with your team, and deliver projects on time.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {features.map((feature) => (
                      <ListItem
                        key={feature.title}
                        title={feature.title}
                        href={feature.href}
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
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
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

          {user ? (
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/dashboard">
                <Button variant="primary" className="h-10 font-medium">
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
                <Button variant="primary" className="h-10 font-medium">
                  Book Demo
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