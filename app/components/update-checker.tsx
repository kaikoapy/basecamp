"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const THREE_HOURS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export function UpdateChecker() {
  useEffect(() => {
    // Function to check for new version
    const checkForUpdate = async () => {
      try {
        // Get the current version hash from the HTML
        const currentVersion = document.documentElement.getAttribute('data-version');
        
        // Fetch the latest version
        const response = await fetch('/api/version');
        const { version: latestVersion } = await response.json();

        // Compare versions and show toast if different
        if (currentVersion && latestVersion && currentVersion !== latestVersion) {
          toast.message("Update Available", {
            description: "A new version of the app is available.",
            action: {
              label: "Update Now",
              onClick: () => window.location.reload(),
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

    return () => clearInterval(interval);
  }, []);

  return null;
} 