import React from "react";
import TutorCard from "@/components/TutorCard";
import SelectedTutorCard from "@/components/SelectedTutorCard";

// This component handles all content rendering for the Lecturer dashboard tabs
export default function LecturerTabContent({
  activeTab,
  paginated,
  selectedApps,
  allApplications,
  reviewData,
  currentPage,
  totalPages,
  setCurrentPage,
}: any) {
  // Generates a unique key for each tutor-application pair
  const getKey = (t: any) => `${t.email}-${t.courseCode}`;

  // Create a list of selected tutors with their average rank across all lecturers
  const selectedWithRank = selectedApps
    .map((t: any) => {
      const key = getKey(t);
      const reviews: any[] = [];

      // Collect reviews across all lecturers
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("tt-review-data-")) {
          const data = JSON.parse(localStorage.getItem(k) || "{}");
          if (data[key]) reviews.push(data[key]);
        }
      });

      // Compute the average rank
      const avgRank =
        reviews.length > 0
          ? Math.round(
              reviews.reduce((sum, r) => sum + Number(r.rank || 0), 0) /
                reviews.length
            )
          : 0;

      return { ...t, rank: avgRank };
    })
    .filter((t: any) => t.rank > 0) // Only include tutors who have been ranked
    // .sort((a, b) => b.rank - a.rank); // Sort by descending rank
    .sort((a: any, b: any) => b.rank - a.rank);


  const mostSelected = selectedWithRank[0]; // Tutor with highest average rank
  const leastSelected = selectedWithRank[selectedWithRank.length - 1]; // Lowest ranked tutor

  // Find tutors who haven’t been selected by any lecturer
  const notSelected = allApplications.filter(
    (app: any) =>
      !selectedApps.some(
        (s: any) => s.email === app.email && s.courseCode === app.courseCode
      )
  );

  return (
    <>
      {/* Tab: Applications - shows tutor cards with pagination */}
      {activeTab === "applications" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((app: any, index: number) => (
              <TutorCard key={index} tutor={app} />
            ))}
          </div>

          {/* Page navigation */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() =>
                setCurrentPage((prev: number) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded font-medium transition ${
                currentPage === 1
                  ? "bg-purple-200 text-white cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              ⬅ Previous
            </button>
            <span>
              Page <strong>{currentPage}</strong> of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded font-medium transition ${
                currentPage === totalPages
                  ? "bg-purple-200 text-white cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Next ➡
            </button>
          </div>
        </>
      )}

      {/* Tab: Selected - shows cards of tutors picked by this lecturer */}
      {activeTab === "selected" && (
        <div className="mt-4">
          {selectedApps.length === 0 ? (
            <p className="text-gray-600">No tutors selected yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedApps.map((tutor: any, index: number) => (
                <SelectedTutorCard key={index} tutor={tutor} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Visual Analysis - shows rankings and selection stats */}
      {activeTab === "visual" && (
        <div className="space-y-8 text-left">
          {/* Summary cards showing top/least/not selected tutors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {/* Highest-ranked tutor */}
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

            {/* Lowest-ranked tutor */}
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

            {/* Tutors not picked by any lecturer */}
            <div className="bg-white p-4 rounded shadow border border-red-200">
              <h3 className="font-semibold text-red-700 mb-1">
                🚫 Not Selected
              </h3>
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

          {/* Detailed table view of tutors and reviews */}
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
                  const isSelected = selectedApps.some(
                    (s: any) =>
                      s.email === t.email && s.courseCode === t.courseCode
                  );

                  const reviews: any[] = [];

                  // Gather review data from every lecturer
                  Object.keys(localStorage).forEach((key) => {
                    if (key.startsWith("tt-review-data-")) {
                      const lecturerReviews = JSON.parse(
                        localStorage.getItem(key) || "{}"
                      );
                      const r = lecturerReviews[getKey(t)];
                      if (r)
                        reviews.push({
                          lecturer: key.replace("tt-review-data-", ""),
                          ...r,
                        });
                    }
                  });

                  const avgRank =
                    reviews.length > 0
                      ? Math.round(
                          reviews.reduce(
                            (sum, r) => sum + Number(r.rank || 0),
                            0
                          ) / reviews.length
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
      )}
    </>
  );
}
