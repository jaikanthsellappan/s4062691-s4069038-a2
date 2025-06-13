import React from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import UserProfile from "@/components/UserProfile";

export default function NavbarLecturer() {
  const router = useRouter();
  const { user } = useUser();

  const goHome = () => {
    router.push("/");
  };

  const isHome = router.pathname === "/";

  return (
    <header className="bg-purple-200 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        {/* Home Button */}
        <button
          onClick={goHome}
          className={`text-sm font-medium hover:underline ${
            isHome ? "text-purple-900 font-bold underline" : "text-purple-700"
          }`}
        >
          Home
        </button>

        <div className="flex-1" />

        {/* 👇 Avatar + Hover Card + Logout + Upload */}
        <UserProfile />
      </div>
    </header>
  );
}
