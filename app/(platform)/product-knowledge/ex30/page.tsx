"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Custom Dialog components for test
const TestDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">
        Email Content
      </DialogPrimitive.Title>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
TestDialogContent.displayName = "TestDialogContent";

const EmailDisplay = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const announcements = useQuery(api.announcements.list);
  const email = announcements?.find((a) => a.isEmailGenerated);

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (!email) return <div>Loading...</div>;

  return (
    <>
      <div className="container max-w-5xl py-6">
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader className="border-b">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    From: {email.createdBy}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(email.postedAt)}
                  </div>
                </div>
                {email.files && email.files.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      {email.files[0].name}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: email.htmlDescription || email.description,
                }}
              />
            </CardContent>
          </Card>

          <Button onClick={() => setDialogOpen(true)}>Open in Dialog</Button>
        </div>
      </div>

      <DialogPrimitive.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <TestDialogContent>
          <div className="border-b space-y-2 pb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                From: {email.createdBy}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(email.postedAt)}
              </div>
            </div>
            {email.files && email.files.length > 0 && (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span className="text-sm text-muted-foreground">
                  {email.files[0].name}
                </span>
              </div>
            )}
          </div>

          <div className="pt-6">
            <div
              dangerouslySetInnerHTML={{
                __html: email.htmlDescription || email.description,
              }}
              className="prose max-w-none"
            />
          </div>
        </TestDialogContent>
      </DialogPrimitive.Root>
    </>
  );
};

export default EmailDisplay;
