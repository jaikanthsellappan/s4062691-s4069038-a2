import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if a user is signed in based on localStorage
    const checkLogin = () => {
      const user = localStorage.getItem("tt-current-user");
      setIsAuthenticated(!!user); // true if user exists, false otherwise
    };

    checkLogin(); // Run it once when the page loads

    // Watch for route or storage changes to re-check login status
    const handleStorageChange = () => checkLogin();
    router.events?.on("routeChangeComplete", checkLogin);
    window.addEventListener("storage", handleStorageChange);

    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      router.events?.off("routeChangeComplete", checkLogin);
    };
  }, [router]);

  // If user is not logged in, block access to protected pages
  const handleProtectedClick = (e: any, path: string) => {
    const user = localStorage.getItem("tt-current-user");

    if (!user) {
      e.preventDefault(); // stop the page from navigating
      alert("⚠️ Please sign in to access this page.");
      router.push("/signin"); // redirect to login
    }
  };

  // Style the current page differently to highlight it
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
