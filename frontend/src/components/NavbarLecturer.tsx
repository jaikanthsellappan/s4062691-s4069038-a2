import React, { useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";

export default function NavbarLecturer() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [showCard, setShowCard] = useState(false);

  const handleLogout = () => {
    setUser(null);
    router.push("/signin");
  };

  const goHome = () => {
    router.push("/");
  };

  const isHome = router.pathname === "/";

  return (
    <header className="bg-purple-200 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <button
          onClick={goHome}
          className={`text-sm font-medium hover:underline ${
            isHome ? "text-purple-900 font-bold underline" : "text-purple-700"
          }`}
        >
          Home
        </button>

        <div className="flex-1" />

        {/* Avatar Button using Heroicons SVG */}
        <div className="relative">
          <button
            onClick={() => setShowCard((prev) => !prev)}
            className="text-purple-800 hover:text-purple-900 focus:outline-none"
            title="User Info"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-8 h-8"
            >
              <path
                fillRule="evenodd"
                d="M12 2a7 7 0 100 14 7 7 0 000-14zm0 18c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Info Card */}
          {showCard && user && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 p-4">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">
                Logged in as
              </h3>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full mt-2"
                />
              )}

              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-red-500 text-white text-sm px-3 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
