"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

const THREE_HOURS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export function UpdateChecker() {
  // Keep track of the current version to avoid duplicate toasts
  const lastVersionRef = useRef<string | null>(null);
  // Keep track of whether user has acted on the current toast
  const hasUserActedRef = useRef(false);

  useEffect(() => {
    // Function to check for new version
    const checkForUpdate = async () => {
      try {
        // Get the current version hash from the HTML
        const currentVersion = document.documentElement.getAttribute('data-version');
        
        // Fetch the latest version
        const response = await fetch('/api/version');
        const { version: latestVersion } = await response.json();

        // Only show toast if:
        // 1. We have both versions
        // 2. They're different
        // 3. This is a new version we haven't notified about
        // 4. User hasn't already acted on the current toast
        if (
          currentVersion && 
          latestVersion && 
          currentVersion !== latestVersion && 
          lastVersionRef.current !== latestVersion &&
          !hasUserActedRef.current
        ) {
          lastVersionRef.current = latestVersion;
          
          toast.message("Update Available", {
            description: "A new version of Basecamp is available.",
            action: {
              label: "Refresh Now",
              onClick: () => {
                hasUserActedRef.current = true;
                window.location.reload();
              },
            },
            onDismiss: () => {
              // Mark as acted upon if user dismisses
              hasUserActedRef.current = true;
            },
            duration: Infinity, // Keep the toast until user acts
          });
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    // Check immediately and then every 3 hours
    checkForUpdate();
    const interval = setInterval(checkForUpdate, THREE_HOURS);

    return () => {
      clearInterval(interval);
      // Reset the refs when component unmounts
      lastVersionRef.current = null;
      hasUserActedRef.current = false;
    };
  }, []);

  return null;
} 