// app/page.tsx
import React from "react";
import  LeaseDisclosureParser  from "../(components)/LeaseDisclosureParser";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <LeaseDisclosureParser />
    </main>
  );
}
