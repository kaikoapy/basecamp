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
