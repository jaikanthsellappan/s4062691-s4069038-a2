import React from "react";
import { useRouter } from "next/router";

// This component displays a dynamic header based on the current page
export default function Header() {
  const router = useRouter();
  const isLecturerPage = router.pathname.startsWith("/lecturers");

  return (
    <header className="bg-purple-600 text-white text-center py-4 text-2xl font-bold shadow">
      {/* Show "Lecturer Console" only on lecturer pages; otherwise show the main app name */}
      {isLecturerPage ? "Lecturer Console" : "TeachTeam Web System"}
    </header>
  );
}
