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
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DEPARTMENTS, POSITIONS } from "@/convex/directory";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
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
      position: "",
      department: "",
      extension: "",
      email: "",
      number: "",
    },
  });

  // Watch the department value
  const currentDepartment = watch("department");

  // Set initial values when contact changes
  useEffect(() => {
    if (contact) {
      reset({
        name: contact.name,
        position: contact.position,
        department: contact.department,
        extension: contact.extension,
        email: contact.email,
        number: contact.number,
      });
    } else {
      reset({
        name: "",
        position: "",
        department: "",
        extension: "",
        email: "",
        number: "",
      });
    }
  }, [contact, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (contact) {
        await update({
          id: contact._id,
          ...data,
        });
      } else {
        await create(data);
      }
      onClose();
      reset();
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

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
              <Label htmlFor="position">Position</Label>
              <Select
                defaultValue={contact?.position}
                onValueChange={(value) => setValue("position", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((department) => (
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
    </Dialog>
  );
}
