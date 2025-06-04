import React, { useState, useRef } from "react";
import { useUser } from "@/context/UserContext"; // ✅ fixed
import axios from "@/api";

export default function UserProfile() {
  const { user, setUser } = useUser();
  const [showCard, setShowCard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  // Helper: Convert uploaded image to base64
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

    const base64 = await convertToBase64(file);
    try {
      await axios.put("/profile/avatar", {
        userId: user.id,
        avatar: base64,
      });
      setUser({ ...user, avatar: base64 });
    } catch (err) {
      alert("Failed to upload avatar.");
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowCard(true)}
      onMouseLeave={() => setShowCard(false)}
      onClick={() => setShowCard(!showCard)}
    >
      {/* Round Avatar Circle */}
      <div className="w-10 h-10 rounded-full bg-white shadow border cursor-pointer overflow-hidden">
        {user.avatar ? (
          <img
            src={`data:image/png;base64,${user.avatar}`}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-purple-700 font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Card on hover/click */}
      {showCard && (
        <div className="absolute top-12 right-0 bg-white border shadow-md rounded-md p-4 z-50 w-64 text-left text-sm">
          <p className="font-semibold text-purple-800 mb-1">{user.name}</p>
          <p className="text-gray-600 mb-1">📧 {user.email}</p>
          <p className="text-gray-600 mb-1">🎓 Role: {user.role}</p>
          <p className="text-gray-600 mb-2">
            📅 Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>

          {/* Edit avatar option for postgraduate users (optional condition) */}
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
        </div>
      )}
    </div>
  );
}
