"use client";

import { SignIn } from "@clerk/nextjs";
import { useEffect } from "react";

export function SignInClientWrapper() {
  useEffect(() => {
    // Store original body style
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Add event listener for Clerk dialog close
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "childList" &&
          !document.querySelector('[role="dialog"]')
        ) {
          // Dialog was removed from DOM, restore scroll
          document.body.style.overflow = originalStyle;
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      document.body.style.overflow = originalStyle;
      observer.disconnect();
    };
  }, []);

  return <SignIn />;
}
