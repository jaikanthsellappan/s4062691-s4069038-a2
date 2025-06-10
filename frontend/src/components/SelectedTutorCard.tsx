import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import axios from "@/api"; // Already configured

export default function SelectedTutorCard({
  tutor,
  onUnselect, // ✅ declare it
}: {
  tutor: any;
  onUnselect?: () => void; // ✅ just define the type, don't use it inside
}) {
  const [rank, setRank] = useState(""); // Stores the tutor's rank input
  const [comment, setComment] = useState(""); // Stores the tutor's comment

  // Create a unique key for saving review data in localStorage
  const key = `${tutor.email}-${tutor.courseCode}`;

  // // Get the currently logged-in lecturer's email
  // const lecturer = JSON.parse(localStorage.getItem("tt-current-user") || "{}");
  // const lecturerEmail = lecturer?.email;
  // const storageKey = `tt-review-data-${lecturerEmail}`;

  const { user } = useUser(); // ✅ get lecturer info from context

  // // Load existing review data (rank and comment) for this tutor, if available
  // useEffect(() => {
  //   const reviewData = JSON.parse(localStorage.getItem(storageKey) || "{}");
  //   if (reviewData[key]) {
  //     setRank(reviewData[key].rank);
  //     setComment(reviewData[key].comment);
  //   }
  // }, [key, storageKey]);
  useEffect(() => {
    if (!user) return;
    const fetchReview = async () => {
      try {
        const response = await axios.get("/tutor-reviews");
        const allReviews = response.data;

        // Find this tutor's review by this lecturer
        const review = allReviews.find(
          (r: any) =>
            r.user?.id === user.id &&
            r.application?.applicationId === tutor.applicationId
        );

        if (review) {
          setRank(review.rank ? review.rank.toString() : ""); // ✅ allow null
          setComment(review.comment || ""); // ✅ allow null
        }
      } catch (error) {
        console.error("Error loading review:", error);
      }
    };

    if (user?.id) {
      fetchReview();
    }
  }, [user, tutor]);
  if (!user) return null;

  // // Save updated rank and comment to localStorage and trigger visual dashboard refresh
  // const saveReview = () => {
  //   const reviewData = JSON.parse(localStorage.getItem(storageKey) || "{}");
  //   reviewData[key] = { rank, comment };
  //   localStorage.setItem(storageKey, JSON.stringify(reviewData));
  //   window.dispatchEvent(new CustomEvent("refresh-visual-analysis"));
  // };
  const saveReview = async () => {
    try {
      const parsedRank = Number(rank);

      // Prevent save if rank is empty, invalid, or out of bounds
      if (!rank || isNaN(parsedRank) || parsedRank < 1 || parsedRank > 10) {
        console.warn("⛔️ Invalid or empty rank. Skipping save.");
        return;
      }

      // Dummy save to localStorage (optional/fallback)
      const dummy = JSON.parse(
        localStorage.getItem(`tt-review-data-${user.email}`) || "{}"
      );
      dummy[`${tutor.email}-${tutor.courseCode}`] = { rank, comment };
      localStorage.setItem(
        `tt-review-data-${user.email}`,
        JSON.stringify(dummy)
      );

      // Save to backend
      await axios.post("/tutor-reviews", {
        userId: user.id,
        applicationId: tutor.applicationId,
        rank: parsedRank,
        comment,
      });

      // Trigger refresh for visual dashboard
      window.dispatchEvent(new CustomEvent("refresh-visual-analysis"));
    } catch (error) {
      console.error("❌ Failed to save review", error);
    }
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
