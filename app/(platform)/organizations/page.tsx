"use client";

import { StandaloneOrganizationSwitcher } from "@/app/(platform)/(components)/organization-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreateOrganization, useOrganizationList } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Plus, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { createLogger } from "@/lib/logger";

const logger = createLogger("organizations-page");

export default function OrganizationsPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [defaultTab, setDefaultTab] = useState<string>("select");
  const { isLoaded, userMemberships } = useOrganizationList();
  const [showNoOrgAlert, setShowNoOrgAlert] = useState(false);

  // Determine which tab to show by default based on whether the user has organizations
  useEffect(() => {
    if (!isLoaded) return;

    const hasOrgs = userMemberships?.count > 0 || (userMemberships?.data && userMemberships.data.length > 0);
    
    logger.debug("Organizations page loaded", {
      hasOrgs,
      userMembershipsCount: userMemberships?.count,
      userMembershipsDataLength: userMemberships?.data?.length,
      reason
    });

    // If redirected due to no org selected, but user has orgs, show the select tab
    if (reason === "no-org-selected" && hasOrgs) {
      setShowNoOrgAlert(true);
      setDefaultTab("select");
    } 
    // If user has no orgs, show the create tab
    else if (!hasOrgs) {
      setDefaultTab("create");
    }
  }, [isLoaded, userMemberships, reason]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="mt-2 text-muted-foreground">
            Select an existing organization or create a new one.
          </p>
        </div>
        
        {showNoOrgAlert && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Organization Required</AlertTitle>
            <AlertDescription>
              You need to select an organization to access the dashboard.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Select Organization
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="select">
            <Card>
              <CardHeader>
                <CardTitle>Select an Organization</CardTitle>
                <CardDescription>
                  Choose from your existing organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <StandaloneOrganizationSwitcher />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Organization</CardTitle>
                <CardDescription>
                  Set up a new organization for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateOrganization 
                  afterCreateOrganizationUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: {
                        width: "100%",
                      },
                      card: {
                        border: "none",
                        boxShadow: "none",
                        width: "100%",
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              Continue to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 