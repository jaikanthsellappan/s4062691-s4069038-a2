import React from "react";
import TutorCard from "@/components/TutorCard";
import SelectedTutorCard from "@/components/SelectedTutorCard";
import LecturerVisualDashboard from "@/components/LecturerVisualDashboard"; // ✅ New component

export default function LecturerTabContent({
  activeTab,
  paginated,
  selectedApps,
  setSelectedApps,
  lecturerEmail,
  allApplications,
  reviewData,
  currentPage,
  totalPages,
  setCurrentPage,
  handleUnselectTutor,
}: any) {
  return (
    <>
      {/* Tab: Applications */}
      {activeTab === "applications" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((app: any, index: number) => (
              <TutorCard
                key={index}
                tutor={app}
                selectedApps={selectedApps}
                setSelectedApps={setSelectedApps}
                lecturerEmail={lecturerEmail}
              />
            ))}
          </div>

          {/* Pagination */}
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

      {/* Tab: Selected Tutors */}
      {activeTab === "selected" && (
        <div className="mt-4">
          {selectedApps.length === 0 ? (
            <p className="text-gray-600">No tutors selected yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedApps.map((tutor: any, index: number) => (
                <SelectedTutorCard
                  key={index}
                  tutor={tutor}
                  onUnselect={() => handleUnselectTutor(tutor)} // ✅ used for backend cleanup
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Visual Analysis - ✅ Refactored */}
      {activeTab === "visual" && (
        <LecturerVisualDashboard
          allApplications={allApplications}
          selectedApps={selectedApps}
          reviewData={reviewData}
        />
      )}
    </>
  );
}
