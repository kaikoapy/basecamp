import { Id } from "./_generated/dataModel";

export interface Announcement {
  _id: Id<"announcements">;
  _creationTime: number;
  title: string;
  description: string;
  images: string[];
  postedAt: string;
  category: string;
  createdBy: string;
  isEmailGenerated: boolean;
  emailMetadata?: {
    from: string;
    originalEmailId: string;
    receivedAt: string;
  };
}

export interface SalesStaffMember {
  _id: Id<"directory">;
  name: string;
  nickname?: string;
  position: string;
  type: "new" | "used";
  displayName: string;
  _creationTime: number;
  number: string;
  department: string;
  extension: string;
  email: string;
}
