import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LecturerTabContent from "@/components/LecturerTabContent";
import axios from "../api";
import { useUser } from "@/context/UserContext";
import { Console } from "console";

export default function LecturersPage() {
  const router = useRouter();

  const { user } = useUser();
  const [reviewData, setReviewData] = useState<any[]>([]);
  const [selectedApps, setSelectedApps] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("applications");
  const [sessionType, setSessionType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [keyword, setKeyword] = useState("");
  const [course, setCourse] = useState("");
  const [tutorName, setTutorName] = useState("");
  const [skill, setSkill] = useState("");
  const [availability, setAvailability] = useState("");
  const [tutorApplications, setTutorApplications] = useState<any[]>([]);
  const [sortField] = useState("course");

  // When the component loads, check if the user is logged in and load relevant data
  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }

    setIsAuthenticated(true);
  }, [user, router]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      try {
        const res = await axios.get("/tutorApplications", {
          params: { userId: user.id },
        });

        // Flatten and add `name` and `email` for filtering
        const appsWithMeta = res.data.map((app: any) => ({
          ...app,
          name: `${app.user.firstName} ${app.user.lastName}`,
          email: app.user.email,
        }));

        setTutorApplications(appsWithMeta);
      } catch (err) {
        console.error("Failed to fetch tutor applications", err);
      }
    };
    fetchApplications();
  }, []);

  // When changing tabs, refresh the list of selected tutors
  useEffect(() => {
    const fetchSelectedTutors = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`/selected-tutors/${user.id}`);
        setSelectedApps(res.data);
        console.log("✅ Loaded selected tutors from DB:", res.data);
      } catch (err) {
        console.error("❌ Failed to load selected tutors:", err);
      }
    };

    fetchSelectedTutors(); // 👈 always run once on mount

    // Also refresh if active tab becomes "selected"
    if (activeTab === "selected") {
      fetchSelectedTutors();
    }
  }, [activeTab, user]);

  // Refresh the visual tab view when ranking data is updated
  useEffect(() => {
    const fetchReviewData = async () => {
      if (!user) return;

      try {
        const res = await axios.get("/tutor-reviews", {
          params: { userId: user.id },
        });

        const reviewRaw = res.data;
        const withMeta = reviewRaw.map((r: any) => {
          const matchingApp = tutorApplications.find(
            (a) => a.applicationId === r.application?.applicationId
          );
          return {
            ...r,
            application: {
              email: matchingApp?.email ?? "",
              courseCode: matchingApp?.courseCode ?? "",
            },
          };
        });

        setReviewData(withMeta);
        console.log("✅ Review data updated:", withMeta);
      } catch (err) {
        console.error("❌ Failed to fetch review data", err);
      }
    };

    // Load initially
    if (activeTab === "visual") {
      fetchReviewData();
    }

    // Listen for refresh event
    const handleRefresh = () => fetchReviewData();
    window.addEventListener("refresh-visual-analysis", handleRefresh);
    return () => {
      window.removeEventListener("refresh-visual-analysis", handleRefresh);
    };
  }, [activeTab, tutorApplications, user]);
  // If viewing visual analysis, collect all rankings from each lecturer and average them
  useEffect(() => {
    const fetchReviewData = async () => {
      if (activeTab === "visual" && user) {
        try {
          const res = await axios.get("/tutor-reviews");

          // 🚨 HACK: match applicationId with allApplications to get actual email/courseCode
          const reviewRaw = res.data;
          const withMeta = reviewRaw.map((r: any) => {
            const matchingApp = tutorApplications.find(
              (a) => a.applicationId === r.application?.applicationId
            );
            return {
              ...r,
              application: {
                email: matchingApp?.email ?? "",
                courseCode: matchingApp?.courseCode ?? "",
              },
            };
          });

          setReviewData(withMeta);
          console.log("✅ Transformed reviewData for frontend:", withMeta);
        } catch (err) {
          console.error("Failed to fetch review data:", err);
        }
      }
    };

    fetchReviewData();
  }, [activeTab, user, tutorApplications]);

  if (!isAuthenticated) return null;

  // Load all tutor applications
  const allApplications = tutorApplications;

  // Apply filtering logic
  const filtered = allApplications.filter((app: any) => {
    const keywordInput = keyword.trim();
    const courseCodeMatch =
      keywordInput === "" || app.courseCode.includes(keywordInput);
    const sessionMatch =
      sessionType === "" ||
      app.role.toLowerCase().includes(sessionType.toLowerCase());
    const courseMatch =
      course === "" ||
      app.courseName.toLowerCase().includes(course.toLowerCase());
    const tutorMatch =
      tutorName === "" ||
      app.name.toLowerCase().includes(tutorName.toLowerCase());
    const skillMatch =
      skill === "" ||
      app.skills?.some((s: string) =>
        s.toLowerCase().includes(skill.toLowerCase())
      );
    const availabilityMatch =
      availability === "" || app.availability === availability;

    return (
      courseMatch &&
      tutorMatch &&
      sessionMatch &&
      skillMatch &&
      availabilityMatch
    );
  });

  // Sort and paginate the filtered data
  const sorted = [...filtered].sort((a, b) =>
    a.courseName.localeCompare(b.courseName)
  );
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReset = () => {
    setKeyword("");
    setCourse("");
    setTutorName("");
    setSkill("");
    setAvailability("");
    setCurrentPage(1);
    setSessionType("");
  };
  const handleUnselectTutor = async (tutor: any) => {
    const updated = selectedApps.filter(
      (s) => !(s.email === tutor.email && s.courseCode === tutor.courseCode)
    );
    setSelectedApps(updated);

    try {
      if (!user) return;
      await axios.delete("/tutor-reviews", {
        data: {
          userId: user.id,
          applicationId: tutor.applicationId, // This must exist in each tutor object
        },
      });
      console.log("✅ Review deleted for", tutor.email, tutor.courseCode);
    } catch (err) {
      console.error("❌ Failed to delete review:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-purple-500 p-6">
      <div className="w-full max-w-7xl mx-auto bg-white rounded shadow-md p-8">
        <h1 className="text-2xl font-bold text-purple-700 text-center mb-6">
          Lecturer Console
        </h1>

        {/* Buttons for switching between tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {["applications", "selected", "visual"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              {tab === "applications"
                ? "Applications"
                : tab === "selected"
                ? "Selected"
                : "Visual Analysis"}
            </button>
          ))}
        </div>

        {/* Filters are shown only on Applications tab */}
        {activeTab === "applications" && (
          <div className="flex flex-wrap items-center gap-4 mb-6 bg-purple-100 p-4 rounded shadow-sm">
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Course Name"
              className="flex-grow border border-purple-400 rounded px-4 py-2 text-sm text-purple-900 bg-white placeholder-purple-600"
            />

            <input
              type="text"
              value={tutorName}
              onChange={(e) => setTutorName(e.target.value)}
              placeholder="Tutor Name"
              className="border border-purple-400 rounded px-4 py-2 text-sm text-purple-900 bg-white placeholder-purple-600"
            />

            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Skill Set"
              className="border border-purple-400 rounded px-4 py-2 text-sm text-purple-900 bg-white placeholder-purple-600"
            />
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="border border-purple-400 rounded px-4 py-2 text-sm text-purple-900 bg-white"
            >
              <option value="">Session Type</option>
              <option value="Tutorial Assistant">Tutorial Assistant</option>
              <option value="Lab Assistant">Lab Assistant</option>
            </select>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="border border-purple-400 rounded px-4 py-2 text-sm text-purple-900 bg-white"
            >
              <option value="">Availability</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
            </select>

            <button
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded text-sm font-medium"
            >
              Reset
            </button>
          </div>
        )}

        {/* Display the selected tab content */}
        <div className="bg-purple-50 p-6 rounded-md space-y-4 text-center text-purple-800 font-medium">
          <LecturerTabContent
            activeTab={activeTab}
            paginated={paginated}
            selectedApps={selectedApps}
            setSelectedApps={setSelectedApps} // NEW
            lecturerEmail={user?.email || ""} // NEW
            allApplications={allApplications}
            reviewData={reviewData}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            handleUnselectTutor={handleUnselectTutor}
          />
        </div>
      </div>
    </div>
  );
}
