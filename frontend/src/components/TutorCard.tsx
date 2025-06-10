import React, { useEffect, useState } from "react";
import axios from "@/api";
import { useUser } from "@/context/UserContext";
interface TutorCardProps {
  tutor: any;
  selectedApps: any[];
  setSelectedApps: React.Dispatch<React.SetStateAction<any[]>>;
  lecturerEmail: string;
}

export default function TutorCard({
  tutor,
  selectedApps,
  setSelectedApps,
  lecturerEmail,
}: TutorCardProps) {
  const [isSelected, setIsSelected] = useState<boolean | null>(null);

  // Set initial selection state based on props
  useEffect(() => {
    if (!Array.isArray(selectedApps)) return;

    const match = selectedApps.some((s) =>
      s.applicationApplicationId
        ? s.applicationApplicationId === tutor.applicationId // from DB
        : s.application?.applicationId === tutor.applicationId || // fallback for relation object
          (s.email === tutor.email && s.courseCode === tutor.courseCode)
    );

    setIsSelected(match);
  }, [selectedApps, tutor]);

  // Inside your component
  const { user } = useUser(); // Access the logged-in lecturer

  const [isLoading, setIsLoading] = useState(false);

  const handleToggleSelect = async () => {
    if (!user || isLoading) return; // 🔒 Prevent double-clicks
    setIsLoading(true);

    try {
      if (isSelected) {
        // ❌ Unselect
        await axios.post("/selected-tutors/delete", {
          userId: user.id,
          applicationId: tutor.applicationId,
        });

        await axios.post("/tutor-reviews/delete", {
          userId: user.id,
          applicationId: tutor.applicationId,
        });

        const res = await axios.get(`/selected-tutors/${user.id}`);
        setSelectedApps(res.data);
        setIsSelected(false);
      } else {
        // ✅ Select
        await axios.post("/selected-tutors", {
          userId: user.id,
          applicationId: tutor.applicationId,
        });

        const res = await axios.get(`/selected-tutors/${user.id}`);
        setSelectedApps(res.data);
        setIsSelected(true);
      }

      window.dispatchEvent(new CustomEvent("refresh-visual-analysis"));
    } catch (err: any) {
      console.error("❌ Toggle failed:", err);
    } finally {
      setIsLoading(false); // 🔓 Unlock after request
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-purple-200 flex flex-col justify-between h-full">
      <div>
        {/* Tutor Info */}
        <h2 className="text-xl font-bold text-purple-700 mb-1">{tutor.name}</h2>
        <p className="text-sm text-gray-600 mb-1">📧 {tutor.email}</p>
        <p className="text-sm text-gray-600 mb-1">
          📘 <strong>{tutor.courseCode}</strong> – {tutor.courseName} (
          {tutor.role})
        </p>
        <p className="text-sm text-gray-600 mb-1">
          🕒 Availability:{" "}
          <span className="font-medium">{tutor.availability}</span>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          💼 Previous Roles: {tutor.previousRoles}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          🎓 Credentials: {tutor.credentials}
        </p>

        {/* Skills display as tags */}
        <div className="flex flex-wrap gap-2 mt-2 mb-3">
          {tutor.skills?.map((skill: string, i: number) => (
            <span
              key={i}
              className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Button to select or unselect tutor */}
      {isSelected !== null && (
        <button
          onClick={handleToggleSelect}
          disabled={isLoading}
          className={`mt-4 py-2 px-4 rounded font-semibold transition ${
            isSelected
              ? "bg-green-100 text-green-700 border border-green-500"
              : "bg-purple-600 text-white hover:bg-purple-700"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSelected ? "✅ Selected (Undo)" : "Select"}
        </button>
      )}
    </div>
  );
}
