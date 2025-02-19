"use client";

import { useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultShifts } from "../../schedule/utils";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

interface ShiftConfigurationProps {
  className?: string;
}

type DayType = keyof typeof defaultShifts;

export function ShiftConfiguration({ className }: ShiftConfigurationProps) {
  const shifts = useQuery(api.shifts.getShifts) ?? defaultShifts;
  const upsertShifts = useMutation(api.shifts.upsertShifts);
  const [editingDayType, setEditingDayType] = useState<DayType | null>(null);
  const [editingShifts, setEditingShifts] = useState<string[]>([]);

  const handleEdit = useCallback((dayType: DayType) => {
    setEditingDayType(dayType);
    setEditingShifts([...shifts[dayType]]);
  }, [shifts]);

  const handleSave = useCallback(async () => {
    if (!editingDayType) return;

    try {
      await upsertShifts({
        shifts: {
          ...shifts,
          [editingDayType]: editingShifts,
        },
      });
      toast.success("Shifts updated successfully");
      setEditingDayType(null);
    } catch (error) {
      toast.error("Failed to update shifts");
      console.error(error);
    }
  }, [editingDayType, editingShifts, shifts, upsertShifts]);

  const handleCancel = useCallback(() => {
    setEditingDayType(null);
    setEditingShifts([]);
  }, []);

  const handleShiftChange = useCallback((index: number, value: string) => {
    setEditingShifts(prev => {
      const newShifts = [...prev];
      newShifts[index] = value;
      return newShifts;
    });
  }, []);

  const dayOrder: DayType[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Shift Configuration</CardTitle>
        <CardDescription>
          Configure available shifts for different days of the week
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {dayOrder.map((dayType) => (
          <div key={dayType} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-lg capitalize">{dayType}</Label>
              {editingDayType === dayType ? (
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => handleEdit(dayType)}>
                  Edit
                </Button>
              )}
            </div>
            <div className="grid gap-2">
              {editingDayType === dayType ? (
                editingShifts.map((shift, index) => (
                  <Input
                    key={index}
                    value={shift}
                    onChange={(e) => handleShiftChange(index, e.target.value)}
                    placeholder="e.g., 9:00-5:00"
                  />
                ))
              ) : (
                <div className="flex flex-wrap gap-2">
                  {shifts[dayType].map((shift: string, index: number) => (
                    <div
                      key={index}
                      className="rounded-md bg-muted px-3 py-1.5 text-sm"
                    >
                      {shift}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 