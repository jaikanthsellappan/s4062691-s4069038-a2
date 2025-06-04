import React from "react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const isLecturerPage = router.pathname.startsWith("/lecturers");

  return (
    <header className="bg-purple-600 text-white text-center py-4 text-2xl font-bold shadow">
      {isLecturerPage ? "Lecturer Console" : "TeachTeam Web System"}
    </header>
  );
}
