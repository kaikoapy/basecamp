import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Users, Car, Building, Trophy, BookOpen } from "lucide-react";

export default function NewHireWelcome() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to Volvo North Miami
          </h1>
          <p className="text-gray-600 text-lg">
            We&apos;re excited to have you join our team as we work towards
            becoming a top 5 Volvo retailer in the nation.
          </p>
        </div>

        {/* Mission and Vision */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-blue-600" />
              <CardTitle>Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Currently ranked #10 nationally, our goal is to become a top 5
                Volvo retailer in the United States. We achieve this through
                exceptional customer service, professional excellence, and a
                commitment to the Volvo brand values.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Key Objectives:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Deliver outstanding customer experiences</li>
                  <li>Maintain highest standards of sales and service</li>
                  <li>Foster a culture of continuous improvement</li>
                  <li>Build long-lasting relationships with our customers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Information */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              <CardTitle>Work Schedule</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Sales Department</h3>
                <ul className="space-y-2">
                  <li>Monday - Friday: 9:00 AM - 8:00 PM</li>
                  <li>Saturday: 9:00 AM - 7:00 PM</li>
                  <li>Sunday: 11:00 AM - 5:00 PM</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Service Department</h3>
                <ul className="space-y-2">
                  <li>Monday - Friday: 7:30 AM - 6:00 PM</li>
                  <li>Saturday: 8:00 AM - 5:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reporting Structure */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <CardTitle>Your Team & Reporting Structure</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Direct Reports</h3>
                  <ul className="space-y-2">
                    <li>General Manager: [Name]</li>
                    <li>Sales Manager: [Name]</li>
                    <li>Service Manager: [Name]</li>
                    <li>HR Manager: [Name]</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Important Contacts</h3>
                  <ul className="space-y-2">
                    <li>HR Department: (xxx) xxx-xxxx</li>
                    <li>IT Support: (xxx) xxx-xxxx</li>
                    <li>Facilities: (xxx) xxx-xxxx</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parking Information */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-600" />
              <CardTitle>Parking Procedure</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Employee parking is located [specific location]. Please follow
                these guidelines:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Park in designated employee areas only</li>
                <li>Display your parking permit at all times</li>
                <li>Customer parking spaces are reserved for customers only</li>
                <li>Report any parking issues to facilities management</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Important Policies */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6 text-blue-600" />
              <CardTitle>Important Policies</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Dress Code</h3>
                <ul className="space-y-2">
                  <li>Professional business attire</li>
                  <li>Name tag must be worn at all times</li>
                  <li>Clean and pressed clothing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Time Off Requests</h3>
                <ul className="space-y-2">
                  <li>Submit requests at least 2 weeks in advance</li>
                  <li>Use the employee portal for submissions</li>
                  <li>Coordinate with your direct supervisor</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Knowledge Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-600" />
              <CardTitle>Product Knowledge: Volvo SUV Lineup</CardTitle>
              <CardDescription>
                Core models that drive our business
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* XC40 */}
              <div className="border-b pb-6">
                <h3 className="text-xl font-semibold mb-3">
                  XC40: Compact Luxury SUV
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Highlights:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Entry-level luxury compact SUV</li>
                      <li>Available in gas and pure electric versions</li>
                      <li>Perfect for urban driving and young professionals</li>
                      <li>Class-leading safety features</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Selling Points:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Starting price point: Most accessible Volvo SUV</li>
                      <li>Google built-in on newer models</li>
                      <li>Generous cargo space for its size</li>
                      <li>Available in Pure Electric Recharge version</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* XC60 */}
              <div className="border-b pb-6">
                <h3 className="text-xl font-semibold mb-3">
                  XC60: Mid-Size Luxury SUV
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Highlights:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Our bestselling model globally</li>
                      <li>Available in mild hybrid and plug-in hybrid</li>
                      <li>Perfect balance of luxury and practicality</li>
                      <li>Award-winning safety technology</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Selling Points:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Elegant Scandinavian design</li>
                      <li>Extended electric range on plug-in hybrid</li>
                      <li>Spacious interior with premium materials</li>
                      <li>Competitive in luxury mid-size segment</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* XC90 */}
              <div className="border-b pb-6">
                <h3 className="text-xl font-semibold mb-3">
                  XC90: Full-Size Luxury SUV
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Highlights:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Flagship 7-seat luxury SUV</li>
                      <li>Available in mild hybrid and plug-in hybrid</li>
                      <li>Most premium offering in our lineup</li>
                      <li>Ideal for luxury family transport</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Selling Points:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>True 7-seat capability</li>
                      <li>Premium Bowers & Wilkins audio available</li>
                      <li>Advanced air suspension</li>
                      <li>Highest level of luxury and technology</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Learning Resources */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Additional Learning Resources
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Internal Resources:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Volvo Retail Experience (VRE) Portal</li>
                      <li>Weekly product training sessions</li>
                      <li>Model comparison sheets</li>
                      <li>Features and specifications guide</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">External Resources:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Volvo Cars USA website</li>
                      <li>Volvo Cars YouTube channel</li>
                      <li>Volvo Cars app</li>
                      <li>Google built-in tutorial videos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Contact */}
        <div className="bg-white rounded-lg p-6 text-center">
          <h3 className="font-semibold mb-4">Questions or Concerns?</h3>
          <p className="text-gray-600">
            Contact HR at [email] or [phone number]
          </p>
        </div>
      </div>
    </div>
  );
}
