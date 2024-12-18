// app/(dashboard)/announcements/new/page.tsx
import AnnouncementForm from "@/app/(platform)/dashboard/announcements/(components)/AccouncementForm";

export default function NewAnnouncementPage() {
  return (
    <div className="container py-10">
      <AnnouncementForm />
    </div>
  );
}
