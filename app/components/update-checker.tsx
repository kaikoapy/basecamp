"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const THREE_HOURS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const VERSION_KEY = 'basecamp_version_shown';

export function UpdateChecker() {
  useEffect(() => {
    // Skip update checking in development
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    // Function to check for new version
    const checkForUpdate = async () => {
      try {
        // Get the current version hash from the HTML
        const currentVersion = document.documentElement.getAttribute('data-version');
        
        // Get the last version we showed a toast for
        const lastShownVersion = localStorage.getItem(VERSION_KEY);
        
        // Fetch the latest version
        const response = await fetch('/api/version');
        const { version: latestVersion } = await response.json();

        // Only show toast if:
        // 1. We have both versions
        // 2. They're different
        // 3. We haven't shown a toast for this version before
        if (
          currentVersion && 
          latestVersion && 
          currentVersion !== latestVersion && 
          lastShownVersion !== latestVersion
        ) {
          // Store this version as the last one we showed
          localStorage.setItem(VERSION_KEY, latestVersion);
          
          toast.message("Update Available", {
            description: "A new version of Basecamp is available.",
            action: {
              label: "Refresh Now",
              onClick: () => {
                // Clear cache and force reload
                window.location.href = window.location.href;
                // Clear any query parameters
                window.history.replaceState({}, '', window.location.pathname);
              },
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