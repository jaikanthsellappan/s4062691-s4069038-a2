import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();

  // Prevent users from accessing protected pages without signing in
  const handleProtectedClick = (e: any, path: string) => {
    if (!user) {
      e.preventDefault();
      alert("⚠️Please sign in to access this page.");
      router.push("/signin");
    }
  };

  // This function styles the current page link to make it stand out
  const linkClass = (path: string) =>
    `hover:underline ${
      router.pathname === path
        ? "font-bold underline text-purple-900"
        : "text-purple-700"
    }`;

  return (
    <nav className="bg-white shadow-md p-4 flex justify-center gap-6 font-medium">
      <Link href="/" className={linkClass("/")}>
        Home
      </Link>
      <Link href="/signin" className={linkClass("/signin")}>
        Login
      </Link>
      <Link
        href="/tutors"
        onClick={(e) => handleProtectedClick(e, "/tutors")}
        className={linkClass("/tutors")}
      >
        Tutors
      </Link>
      <Link
        href="/lecturers"
        onClick={(e) => handleProtectedClick(e, "/lecturers")}
        className={linkClass("/lecturers")}
      >
        Lecturers
      </Link>
    </nav>
  );
}
