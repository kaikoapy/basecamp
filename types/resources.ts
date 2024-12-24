import { Id } from "@/convex/_generated/dataModel";

export interface Resource {
  _id: Id<"resources">;
  _creationTime: number;
  title: string;
  description?: string;
  url?: string;
  isModal?: boolean;
  component?: string;
  image?: string;
  isAffinitySearch?: boolean;
  pinned?: boolean;
  category: string;
  section?: string;
  tags?: string[];
  order?: number;
}
