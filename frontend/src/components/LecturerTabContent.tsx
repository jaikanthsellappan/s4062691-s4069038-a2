import React from "react";
import TutorCard from "@/components/TutorCard";
import SelectedTutorCard from "@/components/SelectedTutorCard";
import LecturerVisualDashboard from "@/components/LecturerVisualDashboard"; // Component for visual representation

// This component manages the content shown in each tab (Applications, Selected, Visual)
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
      {/* Applications Tab - shows list of tutor applications */}
      {activeTab === "applications" && (
        <>
          {/* Display a grid of TutorCards */}
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

          {/* Pagination controls for navigating through pages */}
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

      {/* Selected Tab - shows tutors currently selected by lecturer */}
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
                  onUnselect={() => handleUnselectTutor(tutor)} // Unselects the tutor via backend
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visual Analysis Tab - shows dashboard with charts and stats */}
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
