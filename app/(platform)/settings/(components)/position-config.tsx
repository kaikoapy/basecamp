"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

interface Position {
  id: string;
  name: string;
  originalName: string;
  isActive: boolean;
  department: string;
  updatedAt: number;
}

interface Department {
  id: string;
  name: string;
  originalName: string;
  isActive: boolean;
  updatedAt: number;
}

export function PositionConfig() {
  const config = useQuery(api.position_config.getAll);
  const initialize = useMutation(api.position_config.initialize);
  const updatePositions = useMutation(api.position_config.updatePositions);
  const updateDepartments = useMutation(api.position_config.updateDepartments);

  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeTab, setActiveTab] = useState("positions");

  useEffect(() => {
    if (!config) {
      initialize();
    } else {
      setPositions(config.positions);
      setDepartments(config.departments);
    }
  }, [config, initialize]);

  const handlePositionChange = (id: string, field: "name" | "isActive", value: string | boolean) => {
    const updatedPositions = positions.map((pos) => {
      if (pos.id === id) {
        return { ...pos, [field]: value };
      }
      return pos;
    });
    setPositions(updatedPositions);
  };

  const handleDepartmentChange = (id: string, field: "name" | "isActive", value: string | boolean) => {
    const updatedDepartments = departments.map((dept) => {
      if (dept.id === id) {
        return { ...dept, [field]: value };
      }
      return dept;
    });
    setDepartments(updatedDepartments);
  };

  const savePositions = async () => {
    try {
      await updatePositions({
        positions: positions.map(({ id, name, isActive }) => ({
          id,
          name,
          isActive,
        })),
      });
      toast.success("Positions updated successfully");
    } catch (err) {
      console.error("Failed to update positions:", err);
      toast.error("Failed to update positions");
    }
  };

  const saveDepartments = async () => {
    try {
      await updateDepartments({
        departments: departments.map(({ id, name, isActive }) => ({
          id,
          name,
          isActive,
        })),
      });
      toast.success("Departments updated successfully");
    } catch (err) {
      console.error("Failed to update departments:", err);
      toast.error("Failed to update departments");
    }
  };

  if (!config) return null;

  return (
    <section aria-labelledby="position-config">
      <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
        <div>
          <h2
            id="position-config"
            className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
          >
            Position Configuration
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Customize position titles and departments for your dealership.
          </p>
        </div>

        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
            </TabsList>
            <TabsContent value="positions" className="space-y-4 mt-4">
              <div className="grid gap-4">
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className="flex items-center justify-between space-x-4 rounded-lg border p-4"
                  >
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`position-${position.id}`} className="text-sm text-gray-900 dark:text-gray-50">
                        {position.originalName}
                      </Label>
                      <Input
                        id={`position-${position.id}`}
                        value={position.name}
                        onChange={(e) =>
                          handlePositionChange(position.id, "name", e.target.value)
                        }
                        className="max-w-[300px]"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`active-${position.id}`}
                        checked={position.isActive}
                        onCheckedChange={(checked) =>
                          handlePositionChange(position.id, "isActive", checked)
                        }
                      />
                      <Label htmlFor={`active-${position.id}`} className="text-sm text-gray-900 dark:text-gray-50">
                        Active
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={savePositions}>Save Positions</Button>
              </div>
            </TabsContent>
            <TabsContent value="departments" className="space-y-4 mt-4">
              <div className="grid gap-4">
                {departments.map((department) => (
                  <div
                    key={department.id}
                    className="flex items-center justify-between space-x-4 rounded-lg border p-4"
                  >
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`department-${department.id}`} className="text-sm text-gray-900 dark:text-gray-50">
                        {department.originalName}
                      </Label>
                      <Input
                        id={`department-${department.id}`}
                        value={department.name}
                        onChange={(e) =>
                          handleDepartmentChange(
                            department.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="max-w-[300px]"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`active-${department.id}`}
                        checked={department.isActive}
                        onCheckedChange={(checked) =>
                          handleDepartmentChange(
                            department.id,
                            "isActive",
                            checked
                          )
                        }
                      />
                      <Label htmlFor={`active-${department.id}`} className="text-sm text-gray-900 dark:text-gray-50">
                        Active
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={saveDepartments}>Save Departments</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
} 