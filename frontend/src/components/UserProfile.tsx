import React, { useState, useRef, useEffect } from "react"; // ✅ Added useEffect
import { useUser } from "@/context/UserContext";
import axios from "@/api";
import { useRouter } from "next/router";

export default function UserProfile() {
  const { user, setUser } = useUser();
  const [showCard, setShowCard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // ✅ Detect outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target as Node) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target as Node)
      ) {
        setShowCard(false);
      }
    };

    if (showCard) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCard]);
  if (!user) return null;

  // Convert image to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(reader.result?.toString().split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("userId", user.id.toString());
    formData.append("avatar", file);

    try {
      const response = await axios.put("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Update avatar in user context
      setUser({ ...user, avatar: response.data.avatar });
    } catch (err) {
      alert("Failed to upload avatar.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    router.push("/signin");
  };

  return (
    <div className="relative">
      {/* Clickable Avatar */}
      <button
        ref={avatarButtonRef}
        onClick={() => setShowCard((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-white shadow border cursor-pointer overflow-hidden focus:outline-none"
        title="User Info"
      >
        {user.avatar && user.avatar.startsWith("/uploads/") ? (
          <img
            src={`http://localhost:3001${user.avatar}`}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-purple-700 font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {/* Info Card - toggled by click only */}
      {showCard && (
        <div
          ref={cardRef}
          className={`absolute top-12 right-0 bg-white border shadow-md rounded-md p-4 z-50 w-64 text-left text-sm transition-all duration-300 transform ${
            showCard
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <p className="font-semibold text-purple-800 mb-1">{user.name}</p>
          <p className="text-gray-600 mb-1">📧 {user.email}</p>
          <p className="text-gray-600 mb-1">🎓 Role: {user.role}</p>
          <p className="text-gray-600 mb-2">
            📅 Joined:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Unknown"}
          </p>

          {/* Change Avatar */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-purple-600 text-xs hover:underline"
          >
            ✏️ Change Avatar
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-3 w-full text-xs bg-red-500 text-white py-1 rounded hover:bg-red-600"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
