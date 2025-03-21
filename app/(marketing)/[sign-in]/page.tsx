// app/(marketing)/[sign-in]/page.tsx

"use client"; // This makes the component a client component

import { useUser } from '@clerk/nextjs';
import { SignIn } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SignIn />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {/* Other content for signed-in users */}
    </div>
  );
}
