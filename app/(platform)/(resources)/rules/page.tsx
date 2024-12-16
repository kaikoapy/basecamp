import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserCheck,
  AlertTriangle,
  MessageSquare,
  ClipboardCheck,
  Shield,
} from "lucide-react";

export default function DealershipPolicies() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Volvo North Miami: Dealership Policies & Procedures
          </h1>
          <p className="text-gray-600">
            These policies ensure consistent, professional service and optimal
            performance across all departments.
          </p>
        </div>

        {/* Lead Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-blue-600" />
              <CardTitle>Lead Management & CRM Rules</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Lead Response Times
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Initial response required within 10 minutes during business
                  hours
                </li>
                <li>
                  All leads must receive first contact attempt within 1 hour
                </li>
                <li>Minimum of 6 contact attempts required in first 3 days</li>
                <li>
                  Use all available contact methods (phone, email, text) within
                  compliance
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">
                CRM Documentation Requirements
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>All customer interactions must be logged immediately</li>
                <li>Use proper status updates and outcome codes</li>
                <li>Document all quotes and vehicle discussions</li>
                <li>Update customer preferences and vehicle interests</li>
                <li>Maintain accurate follow-up tasks and appointments</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Lead Attribution Rules
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>First response claims the lead</li>
                <li>
                  Leads cannot be traded or transferred without manager approval
                </li>
                <li>Internet leads are distributed by management only</li>
                <li>Walk-in customers must be logged immediately in CRM</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* General Dealership Rules */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
              <CardTitle>General Dealership Rules</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Professional Standards
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Professional dress code must be maintained at all times</li>
                <li>Name tags must be visible during business hours</li>
                <li>Maintain clean and organized workspaces</li>
                <li>
                  Professional language and behavior required at all times
                </li>
                <li>No eating at desks during business hours</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">
                Attendance & Scheduling
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Arrive 15 minutes before scheduled shift</li>
                <li>Call manager directly for any lateness or absence</li>
                <li>Schedule changes require 48-hour notice</li>
                <li>Coverage must be arranged for any time off</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Customer Interaction Protocols */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <CardTitle>Customer Interaction Protocols</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Communication Standards
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Always use customer&apos;s preferred name and communication
                  method
                </li>
                <li>
                  Respond to all customer inquiries within 1 hour during
                  business hours
                </li>
                <li>Use approved email templates for consistency</li>
                <li>
                  All written communication must be professional and error-free
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">
                Follow-up Requirements
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>48-hour follow-up after initial visit</li>
                <li>7-day follow-up for unsold customers</li>
                <li>30-day follow-up for all sold customers</li>
                <li>Birthday and anniversary recognition for past customers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Compliance and Privacy */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <CardTitle>Compliance and Privacy Rules</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Data Protection</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Never share customer information outside of CRM</li>
                <li>Secure all physical customer documents</li>
                <li>Lock computers when stepping away</li>
                <li>Only use approved systems for customer communication</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">
                Communication Compliance
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Respect Do Not Call lists</li>
                <li>Obtain explicit consent for text messages</li>
                <li>Use approved disclaimers on all communications</li>
                <li>Never discuss customer details on social media</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Consequences Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <CardTitle>Policy Enforcement</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Failure to comply with these policies may result in:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Verbal warning</li>
              <li>Written warning</li>
              <li>Performance improvement plan</li>
              <li>Possible termination for serious violations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
