import React from "react";
import { useRouter } from "next/router";

export default function NavbarLecturer() {
  const router = useRouter();

  // This function logs the user out by removing their info from localStorage
  const handleLogout = () => {
    localStorage.removeItem("tt-current-user");
    router.push("/signin"); // Redirect to login page after logout
  };

  // This function sends the user back to the homepage
  const goHome = () => {
    router.push("/");
  };

  // Used to check if the user is currently on the homepage
  const isHome = router.pathname === "/";

  return (
    <header className="bg-purple-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Home button - highlights when on the home page */}
        <button
          onClick={goHome}
          className={`text-sm font-medium hover:underline ${
            isHome ? "text-purple-900 font-bold underline" : "text-purple-700"
          }`}
        >
          Home
        </button>
        <div className="flex-1" /> {/* Spacer for layout alignment */}
        {/* Logout button for lecturers */}
        <button
          onClick={handleLogout}
          className="bg-purple-600 text-white text-sm px-4 py-1 rounded hover:bg-purple-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
