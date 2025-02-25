"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { createLogger } from "@/lib/logger";
import { useEffect } from "react";
import { useAppAuth } from "@/app/providers/auth-provider";
import { Building } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";

const logger = createLogger("org-switcher");

export function OrganizationSwitcherWrapper({ compact = false }) {
  const { isSignedIn, orgId, orgRole } = useAppAuth();
  const { organization } = useOrganization();

  useEffect(() => {
    logger.debug("Organization Switcher", {
      isSignedIn,
      hasOrg: !!orgId,
      orgId,
      orgRole,
      orgName: organization?.name
    });
  }, [isSignedIn, orgId, orgRole, organization]);

  if (!isSignedIn) return null;

  // If user already has an organization, just display the organization name
  if (orgId && organization) {
    return (
      <div className="flex items-center">
        <div 
          className={`
            flex items-center justify-between gap-2
            ${compact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"}
            rounded-md border border-gray-200 bg-white
            font-medium text-gray-800
          `}
        >
          <Building size={compact ? 14 : 16} className="text-gray-500" />
          <span className="truncate max-w-[160px]">{organization.name}</span>
        </div>
      </div>
    );
  }

  // Only show the organization switcher when the user needs to select an organization
  return (
    <div className="flex items-center">
      <OrganizationSwitcher 
        hidePersonal={true}
        afterCreateOrganizationUrl="/dashboard"
        afterLeaveOrganizationUrl="/"
        afterSelectOrganizationUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: compact ? "4px 8px" : "6px 12px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              backgroundColor: "white",
              color: "#1e293b",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              minWidth: compact ? "160px" : "180px",
              fontSize: compact ? "13px" : "14px",
              "&:hover": {
                backgroundColor: "#f8fafc",
                borderColor: "#cbd5e1",
              },
            }
          }
        }}
      />
    </div>
  );
}

// Standalone version for use in other parts of the UI - for new users who need to select an organization
export function StandaloneOrganizationSwitcher() {
  const { orgId } = useAppAuth();
  const { organization } = useOrganization();

  // If user already has an organization, don't show the switcher
  if (orgId && organization) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
          <Building size={16} />
          <span>Your Dealership:</span>
        </div>
        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 font-medium">
          {organization.name}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
        <Building size={16} />
        <span>Select your dealership:</span>
      </div>
      <OrganizationSwitcher 
        hidePersonal={true}
        afterCreateOrganizationUrl="/dashboard"
        afterLeaveOrganizationUrl="/"
        afterSelectOrganizationUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              backgroundColor: "white",
              color: "#1e293b",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              minWidth: "220px",
              "&:hover": {
                backgroundColor: "#f8fafc",
                borderColor: "#cbd5e1",
              },
            }
          }
        }}
      />
    </div>
  );
} 