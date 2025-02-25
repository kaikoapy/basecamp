"use client";

import { useAppAuth } from "@/app/providers/auth-provider";
import { Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, useOrganizationList } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OrganizationInit() {
  const { isSignedIn, orgId } = useAppAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [dealershipName, setDealershipName] = useState("");
  const { createOrganization } = useOrganizationList();

  // If user is not signed in or already has an organization, don't show this component
  if (!isSignedIn || orgId) {
    return null;
  }

  const handleCreateDealership = async () => {
    if (!dealershipName.trim()) return;
    
    try {
      if (createOrganization) {
        await createOrganization({ name: dealershipName });
        // The user will be automatically redirected to the dashboard
        // based on the afterCreateOrganizationUrl in the OrganizationSwitcher
      }
    } catch (error) {
      console.error("Failed to create dealership:", error);
    }
  };

  if (isCreating) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Create Your Dealership</CardTitle>
          <CardDescription>
            Set up your dealership profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dealership-name">Dealership Name</Label>
              <Input
                id="dealership-name"
                placeholder="Enter your dealership name"
                value={dealershipName}
                onChange={(e) => setDealershipName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateDealership} disabled={!dealershipName.trim()}>
            Create Dealership
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome to Your Dealership Dashboard</h2>
        <p className="text-muted-foreground">
          To get started, please select your dealership or create a new one
        </p>
      </div>

      <div className="grid gap-6 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Building size={20} />
            Select Your Dealership
          </h3>
          <div className="flex items-center justify-center">
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
        </div>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">or</span>
        </div>

        <Button 
          onClick={() => setIsCreating(true)}
          className="w-full"
          variant="outline"
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create a New Dealership
        </Button>
      </div>
    </div>
  );
} 