"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultShifts } from "../../schedule/utils";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Plus, Trash2, Save, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DatePicker from "@/components/comp-511";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const specialDateSchema = z.object({
  date: z.date(),
  type: z.enum(["closed", "custom"]),
  name: z.string().min(1, "Name is required"),
  shifts: z.array(z.string()),
  note: z.string(),
});

type SpecialDateFormValues = z.infer<typeof specialDateSchema>;

interface ShiftManagementProps {
  className?: string;
}

export function ShiftManagement({ className }: ShiftManagementProps) {
  const shifts = useQuery(api.shifts.getShifts) ?? defaultShifts;
  const specialDates = useQuery(api.shifts.getSpecialDates, {}) || [];
  const upsertShifts = useMutation(api.shifts.upsertShifts);
  const addSpecialDate = useMutation(api.shifts.addSpecialDate);
  const removeSpecialDate = useMutation(api.shifts.removeSpecialDate);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingDate, setIsAddingDate] = useState(false);
  const [editedShifts, setEditedShifts] = useState(shifts);

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  const handleSave = async () => {
    try {
      await upsertShifts({
        dayType: "all",
        shifts: editedShifts,
      });
      toast.success("Shifts updated successfully");
      setIsEditMode(false);
    } catch (error) {
      toast.error("Failed to update shifts");
      console.error(error);
    }
  };

  const handleShiftChange = (day: keyof typeof shifts, index: number, value: string) => {
    setEditedShifts(prev => ({
      ...prev,
      [day]: prev[day].map((shift, i) => i === index ? value : shift),
    }));
  };

  // Special Dates Form
  const form = useForm<SpecialDateFormValues>({
    resolver: zodResolver(specialDateSchema),
    defaultValues: {
      type: "closed",
      shifts: [],
      note: "",
    },
  });

  const onSubmitSpecialDate = async (values: SpecialDateFormValues) => {
    try {
      await addSpecialDate({
        date: values.date.toISOString().split('T')[0],
        type: values.type,
        name: values.name,
        shifts: values.shifts,
        note: values.note,
      });
      toast.success("Special date added successfully");
      setIsAddingDate(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add special date");
      console.error(error);
    }
  };

  const handleDeleteSpecialDate = async (date: string) => {
    try {
      await removeSpecialDate({ date });
      toast.success("Special date removed successfully");
    } catch (error) {
      toast.error("Failed to remove special date");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Shift Configuration</CardTitle>
            <CardDescription>Configure regular shifts and special dates</CardDescription>
          </div>
          <Button onClick={() => isEditMode ? handleSave() : setIsEditMode(true)}>
            {isEditMode ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Shifts
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Regular Shifts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Regular Shifts</h3>
              {dayOrder.map((day) => (
                <div key={day} className="space-y-2">
                  <Label className="text-base capitalize">{day}</Label>
                  <div className="grid gap-2">
                    {editedShifts[day].map((shift, index) => (
                      isEditMode ? (
                        <Input
                          key={index}
                          value={shift}
                          onChange={(e) => handleShiftChange(day, index, e.target.value)}
                          placeholder="e.g., 9:00-5:00"
                        />
                      ) : (
                        <div
                          key={index}
                          className="rounded-md bg-muted px-3 py-1.5 text-sm"
                        >
                          {shift}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Special Dates */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Special Dates</h3>
                <Dialog open={isAddingDate} onOpenChange={setIsAddingDate}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Special Date
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Special Date</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitSpecialDate)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <DatePicker 
                                  value={field.value}
                                  onChange={field.onChange}
                                  label="Date"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="closed">Closed</SelectItem>
                                  <SelectItem value="custom">Custom Hours</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Christmas Day" 
                                  onChange={(e) => field.onChange(e.target.value)}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("type") === "custom" && (
                          <FormField
                            control={form.control}
                            name="shifts"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Custom Hours</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., 9:00-3:00" 
                                    onChange={(e) => field.onChange([e.target.value])}
                                    value={field.value?.[0] || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name="note"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Note (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Additional information" 
                                  onChange={(e) => field.onChange(e.target.value)}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddingDate(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Add Date</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {specialDates.map((date) => (
                  <div
                    key={date.date}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{date.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(date.date).toLocaleDateString()} - {date.type}
                        {date.shifts?.length ? ` (${date.shifts.join(", ")})` : ""}
                      </p>
                      {date.note && (
                        <p className="text-sm text-muted-foreground mt-1">{date.note}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSpecialDate(date.date)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {specialDates.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No special dates configured
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 