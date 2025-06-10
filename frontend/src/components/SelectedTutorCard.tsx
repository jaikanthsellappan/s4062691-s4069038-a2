import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import axios from "@/api";

export default function SelectedTutorCard({
  tutor,
  onUnselect,
}: {
  tutor: any;
  onUnselect?: () => void;
}) {
  const [rank, setRank] = useState("");
  const [comment, setComment] = useState("");
  const { user } = useUser();

  // Extract data from nested application object
  const app = tutor.application || {};
  const appUser = app.user || {};

  const name = `${appUser.firstName || ""} ${appUser.lastName || ""}`;
  const email = appUser.email || "";
  const courseCode = app.courseCode || "";
  const courseName = app.courseName || "";

  useEffect(() => {
    if (!user) return;

    const fetchReview = async () => {
      try {
        const response = await axios.get("/tutor-reviews", {
          params: { userId: user.id },
        });

        const review = response.data.find(
          (r: any) =>
            r.user?.id === user.id &&
            r.application?.applicationId === app.applicationId
        );

        if (review) {
          setRank(review.rank ? review.rank.toString() : "");
          setComment(review.comment || "");
        }
      } catch (error) {
        console.error("Error loading review:", error);
      }
    };

    fetchReview();
  }, [user, app]);

  const saveReview = async () => {
    try {
      const parsedRank = Number(rank);
      if (!rank || isNaN(parsedRank) || parsedRank < 1 || parsedRank > 10) {
        console.warn("⛔️ Invalid or empty rank. Skipping save.");
        return;
      }

      await axios.post("/tutor-reviews", {
        userId: user!.id,
        applicationId: app.applicationId,
        rank: parsedRank,
        comment,
      });

      window.dispatchEvent(new CustomEvent("refresh-visual-analysis"));
    } catch (error) {
      console.error("❌ Failed to save review", error);
    }
  };

  const handleRankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = Number(value);

    if (value === "") {
      setRank("");
    } else if (!isNaN(num) && num >= 1 && num <= 10) {
      setRank(value);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-4 rounded shadow border border-purple-200 text-left">
      <h2 className="text-lg font-bold text-purple-700 mb-1">{name}</h2>
      <p className="text-sm text-gray-600 mb-1">{email}</p>
      <p className="text-sm text-gray-600 mb-4">
        {courseCode} – {courseName}
      </p>

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
