import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NavbarLecturer from "./NavbarLecturer";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Check the current path to decide which navbar to show
  const isLecturerPage = router.pathname.startsWith("/lecturers");
  const isTutorPage = router.pathname.startsWith("/tutors");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top page header */}
      <Header />

      {/* Show the lecturer navbar for both lecturer and tutor routes, otherwise default navbar */}
      {isLecturerPage ? (
        <NavbarLecturer />
      ) : isTutorPage ? (
        <NavbarLecturer />
      ) : (
        <Navbar />
      )}

      {/* Main content of the page */}
      <main className="flex-1">{children}</main>

      {/* Bottom page footer */}
      <Footer />
    </div>
  );
}
