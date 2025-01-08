"use client";

import React, { useState } from "react";
import { Search, Phone, Building, Users, Edit2, Mail } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import _ from "lodash";
import { EditForm } from "./(components)/editForm";

type DirectoryContact = Doc<"directory">;

const departmentIcons = {
  Management: Users,
  Sales: Users,
  Service: Users,
  Parts: Users,
  Finance: Users,
  Accounting: Users,
  Logistics: Users,
  Other: Users,
} as const;

type Department = keyof typeof departmentIcons;

const ContactDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [editingContact, setEditingContact] = useState<{
    id: Id<"directory">;
    department: string;
  } | null>(null);

  const contacts = useQuery(api.directory.getAll);
  const address = useQuery(api.directory.getAddress);
  const dealerInfo = useQuery(api.directory.getImportantNumbers) ?? [];
  const updateContact = useMutation(api.directory.update);
  const deleteContact = useMutation(api.directory.deleteContact);

  const handleSaveContact = async (
    updatedContact: Partial<DirectoryContact>
  ) => {
    if (!editingContact) return;

    await updateContact({
      id: editingContact.id,
      ...updatedContact,
    });
    setEditingContact(null);
  };

  const filterContacts = (contacts: DirectoryContact[] = []) => {
    return contacts.filter((contact) => {
      const matchesSearch = Object.values(contact)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesDepartment = selectedDepartment
        ? contact.department === selectedDepartment
        : true;

      return matchesSearch && matchesDepartment;
    });
  };

  const isManager = (position: string) => {
    return (
      position.toLowerCase().includes("manager") ||
      position.toLowerCase().includes("director") ||
      position.toLowerCase().includes("supervisor")
    );
  };

  const groupContactsByDepartment = (contacts: DirectoryContact[] = []) => {
    const grouped = _.groupBy(contacts, "department");

    const managers = contacts.filter((contact) => isManager(contact.position));
    if (managers.length > 0) {
      grouped["Management"] = [
        ...(grouped["Management"] || []),
        ...managers.filter((m) => m.department !== "Management"),
      ];
    }

    return grouped;
  };

  const groupContactsByPosition = (contacts: DirectoryContact[] = []) => {
    return _.groupBy(contacts, "position");
  };

  const DepartmentIndex = () => {
    if (!contacts) return null;

    const departments = Object.keys(groupContactsByDepartment(contacts));

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Departments
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDepartment(null)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors duration-200
              ${
                !selectedDepartment
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
          >
            All
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors duration-200
                flex items-center gap-2
                ${
                  selectedDepartment === dept
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
            >
              {departmentIcons[dept as Department] && (
                <span
                  className={
                    selectedDepartment === dept
                      ? "text-blue-500"
                      : "text-gray-500"
                  }
                >
                  {React.createElement(departmentIcons[dept as Department], {
                    size: 16,
                  })}
                </span>
              )}
              {dept}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const ContactCard = ({ contact }: { contact: DirectoryContact }) => {
    const isEditing = editingContact?.id === contact._id;

    if (isEditing) {
      return (
        <EditForm
          contact={contact}
          onCancel={() => setEditingContact(null)}
          onSave={handleSaveContact}
          onDelete={() => {
            deleteContact({ id: contact._id });
            setEditingContact(null);
          }}
        />
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
        <div className="border-b pb-2 mb-2 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {contact.name}
            </h3>
            <p className="text-sm text-gray-600">{contact.position}</p>
          </div>
          <button
            onClick={() =>
              setEditingContact({
                id: contact._id,
                department: contact.department,
              })
            }
            className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {contact.extension && (
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              <span>Ext: {contact.extension}</span>
            </div>
          )}
          {contact.number && (
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              <span>{contact.number}</span>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              <span>{contact.email}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DepartmentSection = ({
    title,
    contacts = [],
    department,
  }: {
    title: string;
    contacts: DirectoryContact[];
    department: string;
  }) => {
    const filteredList = filterContacts(contacts);
    if (filteredList.length === 0) return null;

    const Icon = departmentIcons[department as Department] || Users;
    const groupedByPosition = groupContactsByPosition(filteredList);

    const sortedPositions = Object.entries(groupedByPosition).sort(
      ([posA], [posB]) => {
        const isManagerA = isManager(posA);
        const isManagerB = isManager(posB);
        if (isManagerA && !isManagerB) return -1;
        if (!isManagerA && isManagerB) return 1;
        return posA.localeCompare(posB);
      }
    );

    return (
      <div
        id={`department-${department}`}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div className="flex items-center mb-6">
          <Icon className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800 ml-2">{title}</h2>
        </div>

        <div className="space-y-8">
          {sortedPositions.map(([position, positionContacts]) => (
            <div key={position} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 border-b pb-2">
                {position}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {positionContacts.map((contact) => (
                  <ContactCard key={contact._id} contact={contact} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!contacts) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Volvo Cars North Miami Directory
          </h1>
          {address && (
            <div className="flex items-center mb-4 text-gray-600">
              <Building className="w-5 h-5 mr-2" />
              {address}
            </div>
          )}
        </div>
      </div>

      <DepartmentIndex />
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {dealerInfo.length > 0 && (
        <div className="mt-4 mb-8 bg-blue-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Important Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dealerInfo.map((info, index) => (
              <div key={index} className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm">
                  <span className="font-medium">{info.name}:</span> {info.phone}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {Object.entries(groupContactsByDepartment(contacts))
          .filter(
            ([department]) =>
              !selectedDepartment || department === selectedDepartment
          )
          .map(([department, deptContacts]) => (
            <DepartmentSection
              key={department}
              title={department ? `${department} Department` : "Other"}
              contacts={deptContacts as DirectoryContact[]}
              department={department}
            />
          ))}
      </div>
    </div>
  );
};

export default ContactDirectory;
