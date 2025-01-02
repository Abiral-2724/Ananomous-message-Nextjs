// app/(app)/layout.tsx

import Navbar from "@/components/Navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar /> {/* Navbar specific to routes in (app) */}
      {children}
    </div>
  );
}
