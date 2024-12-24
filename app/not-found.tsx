"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NotFoundContent() {
  return (
    <Suspense>
      <NotFoundInner />
    </Suspense>
  );
}

function NotFoundInner() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  useEffect(() => {
    console.log("404 from:", from);
  }, [from]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl mt-4">Page not found</p>
      {from && (
        <p className="text-sm text-muted-foreground mt-2">From: {from}</p>
      )}
    </div>
  );
}

export default function NotFound() {
  return <NotFoundContent />;
}
