// components/Header.tsx
import React from "react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  // Check if the current page is a lecturer page based on the URL path
  const isLecturerPage = router.pathname.startsWith("/lecturers");

  return (
    <header className="bg-purple-600 text-white text-center py-4 text-2xl font-bold shadow">
      {/* Show different headings depending on whether it's a lecturer page */}
      {isLecturerPage ? "Lecturer Console" : "TeachTeam Web System"}
    </header>
  );
}
