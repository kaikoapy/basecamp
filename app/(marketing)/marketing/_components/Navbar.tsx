"use client";

import { siteConfig } from "@/app/siteConfig";
import useScroll from "../lib/use-scroll";
import { cn } from "@/lib/utils";
import { RiCloseLine, RiMenuLine } from "@remixicon/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "./Button";
import { useUser } from "@clerk/nextjs";
import { UserNav } from "./UserNav";

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
        "animate-slide-down-fade fixed inset-x-3 top-4 z-50 mx-auto flex max-w-6xl transform-gpu justify-center overflow-hidden rounded-xl border border-transparent px-3 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
        open === true ? "h-52" : "h-16",
        scrolled || open === true
          ? "backdrop-blur-nav max-w-3xl border-gray-100 bg-white/80 shadow-xl shadow-black/5 dark:border-white/15 dark:bg-black/70"
          : "bg-white/0 dark:bg-gray-950/0",
      )}
    >
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href={siteConfig.baseLinks.home} aria-label="Home">
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
          <nav className="hidden md:absolute md:left-1/2 md:top-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
            <div className="flex items-center gap-10 font-medium">
            <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href={siteConfig.baseLinks.changelog}
              >
                Features
              </Link>
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href={siteConfig.baseLinks.pricing}
              >
                Pricing
              </Link>
              <Link
                className="px-2 py-1 text-gray-900 dark:text-gray-50"
                href={siteConfig.baseLinks.about}
              >
                About
              </Link>
            </div>
          </nav>

          {user ? (
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/uplist">
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

          <div className="flex gap-x-2 md:hidden">
            <Button variant="primary" className="h-10 font-medium">Book demo</Button>
            <Button
              onClick={() => setOpen(!open)}
              variant="ghost"
              className="h-10 aspect-square p-2"
            >
              {open ? (
                <RiCloseLine aria-hidden="true" className="size-5" />
              ) : (
                <RiMenuLine aria-hidden="true" className="size-5" />
              )}
            </Button>
          </div>
        </div>

        <nav
          className={cn(
            "my-6 flex text-lg ease-in-out will-change-transform md:hidden",
            open ? "" : "hidden",
          )}
        >
          <ul className="space-y-4 font-medium">
            <li onClick={() => setOpen(false)}>
              <Link href={siteConfig.baseLinks.about}>About</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href={siteConfig.baseLinks.pricing}>Pricing</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href={siteConfig.baseLinks.changelog}>Changelog</Link>
            </li>

            {user ? (
              <>
                <li onClick={() => setOpen(false)}>
                  <Link href="/uplist">See your Dashboard</Link>
                </li>
                <li onClick={() => setOpen(false)}>
                  <UserNav
                    image={user?.imageUrl ?? ""}
                    name={user?.fullName ?? "User"}
                    email={user?.primaryEmailAddress?.emailAddress ?? "No email"}
                  />
                </li>
              </>
            ) : (
              <>
                <li onClick={() => setOpen(false)}>
                  <Link href="/sign-in">Sign in</Link>
                </li>
                <li onClick={() => setOpen(false)}>
                  <Link href="/about">Get Started</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}