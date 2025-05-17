import React, { useEffect, useState } from "react";

export default function TutorCard({ tutor }: { tutor: any }) {
  const [isSelected, setIsSelected] = useState(false);

  // Get the currently logged-in lecturer from localStorage
  const lecturer = JSON.parse(localStorage.getItem("tt-current-user") || "{}");

  // Check if the tutor has already been selected by this lecturer
  useEffect(() => {
    const key = `tt-selected-tutors-${lecturer.email}`;
    const lecturerSelections = JSON.parse(localStorage.getItem(key) || "[]");

    const alreadySelected = lecturerSelections.some(
      (t: any) => t.email === tutor.email && t.courseCode === tutor.courseCode
    );

    setIsSelected(alreadySelected);
  }, [tutor.email, tutor.courseCode, lecturer.email]);

  // Handles adding or removing the tutor from the selection list
  const handleToggleSelect = () => {
    const key = `tt-selected-tutors-${lecturer.email}`;
    const lecturerSelections = JSON.parse(localStorage.getItem(key) || "[]");

    let updatedSelections;

    if (isSelected) {
      // Remove tutor from selection
      updatedSelections = lecturerSelections.filter(
        (t: any) =>
          !(t.email === tutor.email && t.courseCode === tutor.courseCode)
      );
    } else {
      // Add tutor to selection
      updatedSelections = [...lecturerSelections, tutor];
    }

    localStorage.setItem(key, JSON.stringify(updatedSelections));
    setIsSelected(!isSelected); // Flip selection state
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
      <button
        onClick={handleToggleSelect}
        className={`mt-4 py-2 px-4 rounded font-semibold transition ${
          isSelected
            ? "bg-green-100 text-green-700 border border-green-500"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {isSelected ? "✅ Selected (Undo)" : "Select"}
      </button>
    </div>
  );
}
