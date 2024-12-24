import { Id } from "@/convex/_generated/dataModel";

export interface DirectoryEntry {
  _id: Id<"directory">;
  _creationTime: number;
  name: string;
  position: string;
  department: string;
  email?: string;
  number?: string;
  extension?: string;
}
