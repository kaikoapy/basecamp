"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NewPositionDialog } from "./new-position-dialog";
import { Plus } from "lucide-react";

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

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nickname: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  extension: z.string(),
  email: z.string().email("Invalid email address"),
  number: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface EditFormProps {
  contact?: {
    _id: Id<"directory">;
    name: string;
    nickname?: string;
    position: string;
    department: string;
    extension: string;
    email: string;
    number: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function EditForm({ contact, isOpen, onClose }: EditFormProps) {
  const update = useMutation(api.directory.update);
  const create = useMutation(api.directory.create);

  // Fetch positions and departments from the database
  const config = useQuery(api.position_config.getAll);
  const initialize = useMutation(api.position_config.initialize);

  // Initialize if no config exists
  useEffect(() => {
    if (config === null) {
      initialize();
    }
  }, [config, initialize]);
  
  const activeDepartments = config?.departments
    .filter((dept: Department) => dept.isActive)
    .map((dept: Department) => dept.name) || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: contact || {
      name: "",
      nickname: "",
      position: "",
      department: "",
      extension: "",
      email: "",
      number: "",
    },
  });

  // Watch the department value
  const currentDepartment = watch("department");

  // Get the department for a position
  const getDepartmentForPosition = (positionName: string) => {
    const position = config?.positions.find(pos => pos.name === positionName);
    return position?.department || "";
  };

  // Set initial values when contact changes
  useEffect(() => {
    if (contact) {
      reset({
        name: contact.name,
        nickname: contact.nickname || "",
        position: contact.position,
        department: contact.department,
        extension: contact.extension,
        email: contact.email,
        number: contact.number,
      });
    } else {
      reset({
        name: "",
        nickname: "",
        position: "",
        department: "",
        extension: "",
        email: "",
        number: "",
      });
    }
  }, [contact, reset]);

  const [isNewPositionDialogOpen, setIsNewPositionDialogOpen] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      if (contact) {
        await update({
          id: contact._id,
          ...data,
        });
        toast.success("Contact Updated", {
          description: "The directory contact has been successfully updated.",
        });
      } else {
        await create(data);
        toast.success("Contact Added", {
          description: "The new contact has been successfully added.",
        });
      }
      onClose();
      reset();
    } catch (error) {
      console.error("Error saving contact:", error);
      
      toast.error("Error", {
        description: "Failed to save contact. Please try again.",
      });
    }
  };

  // Group positions by department
  const positionsByDepartment = config?.positions
    .filter((pos: Position) => pos.isActive)
    .reduce((acc: Record<string, string[]>, pos: Position) => {
      if (!acc[pos.department]) {
        acc[pos.department] = [];
      }
      acc[pos.department].push(pos.name);
      return acc;
    }, {});

  // Sort departments for consistent ordering
  const sortedDepartments = Object.keys(positionsByDepartment || {}).sort();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contact ? "Edit Contact" : "Add Contact"}</DialogTitle>
          <DialogDescription>
            Make changes to the contact information here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nickname">Nickname (Optional)</Label>
              <Input
                id="nickname"
                {...register("nickname")}
                placeholder="e.g. Senior, Jr, etc"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="position">Position</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => setIsNewPositionDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New
                </Button>
              </div>
              <Select
                defaultValue={contact?.position}
                onValueChange={(value) => {
                  setValue("position", value);
                  // Auto-select the department based on the position
                  const department = getDepartmentForPosition(value);
                  setValue("department", department);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {sortedDepartments.map((department, index) => (
                    <div key={department}>
                      {index > 0 && <SelectSeparator />}
                      <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                        {department}
                      </div>
                      {positionsByDepartment?.[department].sort().map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              {errors.position && (
                <p className="text-sm text-red-500">
                  {errors.position.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={currentDepartment}
                onValueChange={(value) => setValue("department", value)}
                disabled={!!watch("position")} // Disable department selection when position is selected
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {activeDepartments.map((department: string) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="extension">Extension</Label>
              <Input id="extension" {...register("extension")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="number">Phone Number</Label>
              <Input id="number" {...register("number")} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {contact ? "Save changes" : "Add contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <NewPositionDialog
        isOpen={isNewPositionDialogOpen}
        onClose={() => setIsNewPositionDialogOpen(false)}
        departments={activeDepartments}
      />
    </Dialog>
  );
}
