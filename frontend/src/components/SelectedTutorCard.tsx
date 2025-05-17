import React from "react";
import { useEffect, useState } from "react";

export default function SelectedTutorCard({ tutor }: { tutor: any }) {
  const [rank, setRank] = useState(""); // Stores the tutor's rank input
  const [comment, setComment] = useState(""); // Stores the tutor's comment

  // Create a unique key for saving review data in localStorage
  const key = `${tutor.email}-${tutor.courseCode}`;

  // Get the currently logged-in lecturer's email
  const lecturer = JSON.parse(localStorage.getItem("tt-current-user") || "{}");
  const lecturerEmail = lecturer?.email;
  const storageKey = `tt-review-data-${lecturerEmail}`;

  // Load existing review data (rank and comment) for this tutor, if available
  useEffect(() => {
    const reviewData = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (reviewData[key]) {
      setRank(reviewData[key].rank);
      setComment(reviewData[key].comment);
    }
  }, [key, storageKey]);

  // Save updated rank and comment to localStorage and trigger visual dashboard refresh
  const saveReview = () => {
    const reviewData = JSON.parse(localStorage.getItem(storageKey) || "{}");
    reviewData[key] = { rank, comment };
    localStorage.setItem(storageKey, JSON.stringify(reviewData));
    window.dispatchEvent(new CustomEvent("refresh-visual-analysis"));
  };

  // Only accept numbers from 1 to 10 for ranking
  const handleRankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setRank("");
      return;
    }

    const num = Number(value);

    if (!isNaN(num) && num >= 1 && num <= 10) {
      setRank(value);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow border border-purple-200 text-left">
      <h2 className="text-lg font-bold text-purple-700 mb-1">{tutor.name}</h2>
      <p className="text-sm text-gray-600 mb-1">{tutor.email}</p>
      <p className="text-sm text-gray-600 mb-4">
        {tutor.courseCode} – {tutor.courseName}
      </p>

      {/* Rank input field */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rank (1–10):
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={rank}
          onChange={handleRankChange}
          onBlur={saveReview}
          className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Comment input field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comment:
        </label>
        <textarea
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onBlur={saveReview}
          className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-purple-400"
        />
      </div>
    </div>
  );
}
