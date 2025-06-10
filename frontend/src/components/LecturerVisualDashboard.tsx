/**
 * COMPONENT: LecturerVisualDashboard.tsx
 *
 * PURPOSE: This component handles all visual data representations for tutor selection and reviews.
 *
 * ARCHITECTURAL DECISION:
 * We refactor the visualization logic into a separate component to maintain the Single Responsibility Principle (SRP).
 * This improves code readability, supports reuse, and isolates UI rendering from business logic (data fetching, processing).
 *
 * ADVANTAGES:
 * - Makes the codebase modular and maintainable.
 * - Future visualizations (e.g., charts) can be added without modifying core tab logic.
 * - Easier testing and debugging of visual display logic.
 */

import React from "react";

export default function LecturerVisualDashboard({
  selectedApps,
  allApplications,
  reviewData,
}: {
  selectedApps: any[];
  allApplications: any[];
  reviewData: any[];
}) {
  const getKey = (t: any) => `${t.email}-${t.courseCode}`;

  const selectedWithRank = selectedApps
    .map((t: any) => {
      const tutorEmail =
        t.email || t.application?.user?.email || t.application?.email;
      const tutorCourse = t.courseCode || t.application?.courseCode;

      const tutorReviews = reviewData.filter(
        (r: any) =>
          r.application?.email === tutorEmail &&
          r.application?.courseCode === tutorCourse
      );

      const avgRank =
        tutorReviews.length > 0
          ? Math.round(
              tutorReviews.reduce((sum, r) => sum + Number(r.rank || 0), 0) /
                tutorReviews.length
            )
          : 0;

      return { ...t, rank: avgRank };
    })
    .filter((t: any) => t.rank > 0)
    .sort((a: any, b: any) => b.rank - a.rank);

  const mostSelected = selectedWithRank[0];
  const leastSelected = selectedWithRank[selectedWithRank.length - 1];

  const notSelected = allApplications.filter((app: any) => {
    const appEmail =
      app.email || app.user?.email || app.application?.user?.email;
    const appCourse = app.courseCode || app.application?.courseCode;

    return !selectedApps.some((s: any) => {
      const selEmail =
        s.email || s.application?.user?.email || s.application?.email;
      const selCourse = s.courseCode || s.application?.courseCode;
      return selEmail === appEmail && selCourse === appCourse;
    });
  });

  return (
    <div className="space-y-8 text-left">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white p-4 rounded shadow border border-green-200">
          <h3 className="font-semibold text-green-700 mb-1">
            🥇 Most Selected
          </h3>
          {mostSelected ? (
            <>
              <p className="text-purple-700">{mostSelected.name}</p>
              <p className="text-gray-600">
                {mostSelected.courseCode} – Rank: {mostSelected.rank}
              </p>
            </>
          ) : (
            <p className="text-gray-500">No ranking data yet.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow border border-yellow-200">
          <h3 className="font-semibold text-yellow-700 mb-1">
            🥈 Least Selected
          </h3>
          {leastSelected ? (
            <>
              <p className="text-purple-700">{leastSelected.name}</p>
              <p className="text-gray-600">
                {leastSelected.courseCode} – Rank: {leastSelected.rank}
              </p>
            </>
          ) : (
            <p className="text-gray-500">No ranking data yet.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow border border-red-200">
          <h3 className="font-semibold text-red-700 mb-1">🚫 Not Selected</h3>
          {notSelected.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {notSelected.map((t: any, idx: number) => (
                <li key={idx}>
                  {t.name} – {t.courseCode}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">All tutors selected.</p>
          )}
        </div>
      </div>

      {/* Table of All Tutors */}
      <div className="overflow-auto">
        <table className="w-full text-sm bg-white border border-gray-300 rounded shadow">
          <thead className="bg-purple-200 text-purple-800 font-semibold">
            <tr>
              <th className="p-2 text-left">Tutor Name</th>
              <th className="p-2 text-left">Course</th>
              <th className="p-2 text-left">Selected?</th>
              <th className="p-2 text-left">Rank</th>
              <th className="p-2 text-left">Comment</th>
            </tr>
          </thead>
          <tbody>
            {allApplications.map((t: any, index: number) => {
              const tutorEmail =
                t.email || t.application?.user?.email || t.user?.email;
              const tutorCourse =
                t.courseCode ||
                t.application?.courseCode ||
                t.course?.courseCode;

              const isSelected = selectedApps.some(
                (s: any) =>
                  (s.email || s.application?.user?.email) === tutorEmail &&
                  (s.courseCode || s.application?.courseCode) === tutorCourse
              );

              const reviews = Array.isArray(reviewData)
                ? reviewData
                    .filter(
                      (r: any) =>
                        r.application?.email === tutorEmail &&
                        r.application?.courseCode === tutorCourse
                    )
                    .map((r: any) => ({
                      lecturer:
                        `${r.user?.firstName || ""} ${
                          r.user?.lastName || ""
                        }`.trim() || r.user?.email,
                      rank: r.rank,
                      comment: r.comment,
                    }))
                : [];

              const avgRank =
                reviews.length > 0
                  ? Math.round(
                      reviews.reduce((sum, r) => sum + Number(r.rank || 0), 0) /
                        reviews.length
                    )
                  : "—";

              return (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-2">{t.name}</td>
                  <td className="p-2">{t.courseCode}</td>
                  <td className="p-2">{isSelected ? "✅ Yes" : "❌ No"}</td>
                  <td className="p-2">{isSelected ? avgRank : "—"}</td>
                  <td className="p-2">
                    {isSelected && reviews.length > 0 ? (
                      <ul className="list-disc list-inside text-xs text-left">
                        {reviews.map((r, i) => (
                          <li key={i}>
                            <strong>{r.lecturer}:</strong>{" "}
                            {r.comment || "No comment"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
