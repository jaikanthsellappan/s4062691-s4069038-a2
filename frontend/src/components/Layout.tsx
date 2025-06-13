import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NavbarLecturer from "./NavbarLecturer";
import { useRouter } from "next/router";

// Layout component wraps all pages with a consistent structure
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Determine the type of page based on the current route
  const isLecturerPage = router.pathname.startsWith("/lecturers");
  const isTutorPage = router.pathname.startsWith("/tutors");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Display a header at the top of the page */}
      <Header />

      {/* Use the lecturer-specific navbar for lecturer and tutor pages, otherwise use the default navbar */}
      {isLecturerPage ? (
        <NavbarLecturer />
      ) : isTutorPage ? (
        <NavbarLecturer />
      ) : (
        <Navbar />
      )}

      {/* Display the main content for the current page */}
      <main className="flex-1">{children}</main>

      {/* Display a footer at the bottom of the page */}
      <Footer />
    </div>
  );
}
