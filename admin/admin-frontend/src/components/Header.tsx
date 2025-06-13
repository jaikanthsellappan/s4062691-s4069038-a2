import React from "react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    router.push("/login");
  };

  return (
    <header className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <div className="text-xl font-bold">TeachTeam Admin Portal</div>
      <div className="space-x-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-white text-purple-700 px-4 py-1 rounded hover:bg-purple-100 font-medium"
        >
          Home
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
