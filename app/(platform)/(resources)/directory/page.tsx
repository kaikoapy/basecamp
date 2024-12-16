import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Wrench,
  DollarSign,
  ShieldCheck,
  HeartHandshake,
  ClipboardList,
  Building,
} from "lucide-react";

export default function ContactDirectory() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Volvo North Miami Directory
          </h1>
          <p className="text-gray-600">
            Internal contact information for all departments
          </p>
        </div>

        {/* Executive Leadership */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6 text-blue-600" />
              <CardTitle>Executive Leadership</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">General Manager</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Larry Johnson</span>
                  </p>
                  <p>📞 Ext: 101</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ ljohnson@volvonorthmiami.com</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Operations Director</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Sarah Martinez</span>
                  </p>
                  <p>📞 Ext: 102</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ smartinez@volvonorthmiami.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Department */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <CardTitle>Sales Department</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">New Car Sales Manager</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Mike Thompson</span>
                  </p>
                  <p>📞 Ext: 201</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ mthompson@volvonorthmiami.com</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Pre-Owned Sales Manager</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">David Rodriguez</span>
                  </p>
                  <p>📞 Ext: 202</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ drodriguez@volvonorthmiami.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Department */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-blue-600" />
              <CardTitle>Service Department</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Service Manager</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Robert Chen</span>
                  </p>
                  <p>📞 Ext: 301</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ rchen@volvonorthmiami.com</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Service Advisor Lead</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Lisa Parker</span>
                  </p>
                  <p>📞 Ext: 302</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ lparker@volvonorthmiami.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parts Department */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-blue-600" />
              <CardTitle>Parts Department</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Parts Manager</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">James Wilson</span>
                  </p>
                  <p>📞 Ext: 401</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ jwilson@volvonorthmiami.com</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Parts Counter Lead</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Carlos Ruiz</span>
                  </p>
                  <p>📞 Ext: 402</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ cruiz@volvonorthmiami.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finance Department */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <CardTitle>Finance Department</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Finance Director</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Patricia Lee</span>
                  </p>
                  <p>📞 Ext: 501</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ plee@volvonorthmiami.com</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Finance Manager</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Mark Stevens</span>
                  </p>
                  <p>📞 Ext: 502</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ mstevens@volvonorthmiami.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Departments */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-blue-600" />
              <CardTitle>Support Departments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Human Resources</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Maria Garcia</span>
                  </p>
                  <p>📞 Ext: 601</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ mgarcia@volvonorthmiami.com</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">IT Support</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Tech Support Desk</span>
                  </p>
                  <p>📞 Ext: 701</p>
                  <p>📱 (305) XXX-XXXX</p>
                  <p>✉️ itsupport@volvonorthmiami.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-red-600" />
              <CardTitle>Emergency Contacts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Security</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Security Office</span>
                  </p>
                  <p>📞 Ext: 911</p>
                  <p>📱 (305) XXX-XXXX</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Facilities</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Maintenance Team</span>
                  </p>
                  <p>📞 Ext: 801</p>
                  <p>📱 (305) XXX-XXXX</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
