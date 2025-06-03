import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LecturerTabContent from "@/components/LecturerTabContent";
import axios from "../api";
import { Console } from "console";

export default function LecturersPage() {
  const router = useRouter();

  const [lecturerEmail, setLecturerEmail] = useState("");
  const [reviewData, setReviewData] = useState({});
  const [selectedApps, setSelectedApps] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("applications");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [keyword, setKeyword] = useState("");
  const [course, setCourse] = useState("");
  const [tutorName, setTutorName] = useState("");
  const [skill, setSkill] = useState("");
  const [availability, setAvailability] = useState("");
  const [sortField] = useState("course");

  // When the component loads, check if the user is logged in and load relevant data
  useEffect(() => {
    const user = localStorage.getItem("tt-current-user");

    if (!user) {
      alert("Please sign in to access this page.");
      router.push("/signin");
    } else {
      const parsed = JSON.parse(user);
      const email = parsed.email || "";
      setLecturerEmail(email);


      const selected = JSON.parse(
        localStorage.getItem(`tt-selected-tutors-${email}`) || "[]"
      );
      setSelectedApps(selected);

      const reviews = JSON.parse(
        localStorage.getItem(`tt-review-data-${email}`) || "{}"
      );
      setReviewData(reviews);

      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() =>{
    const fetchApplications = async () => {
    const user = localStorage.getItem("tt-current-user");
    if (!user) return;

    const parsed = JSON.parse(user);
    const userId = parsed.id;

    try {
      const res = await axios.get("/tutorApplications", {
        params: { userId }
      });
      console.log("tutor applications from database",res.data);
    } catch (err) {
      console.error("Failed to fetch tutor applications", err);
    }
  };
  fetchApplications();

  },[])

  // When changing tabs, refresh the list of selected tutors
  useEffect(() => {
    setCurrentPage(1);

    if (activeTab === "selected") {
      const lecturer = JSON.parse(
        localStorage.getItem("tt-current-user") || "{}"
      );
      const updated = JSON.parse(
        localStorage.getItem(`tt-selected-tutors-${lecturer.email}`) || "[]"
      );
      setSelectedApps(updated);
    }
  }, [activeTab]);

  // Refresh the visual tab view when ranking data is updated
  useEffect(() => {
    const handleRefresh = () => {
      if (activeTab === "visual") {
        setActiveTab("");
        setTimeout(() => setActiveTab("visual"), 0);
      }
    };

    window.addEventListener("refresh-visual-analysis", handleRefresh);
    return () =>
      window.removeEventListener("refresh-visual-analysis", handleRefresh);
  }, [activeTab]);

  // If viewing visual analysis, collect all rankings from each lecturer and average them
  useEffect(() => {
    const updatedReviewData: Record<string, any[]> = {};

    if (activeTab === "visual") {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("tt-review-data-")) {
          const lecturerData = JSON.parse(localStorage.getItem(key) || "{}");
          Object.entries(lecturerData).forEach(([k, v]) => {
            if (!updatedReviewData[k]) updatedReviewData[k] = [];
            updatedReviewData[k].push(v);
          });
        }
      });

      setReviewData(() => {
        const merged: Record<string, any> = {};
        Object.entries(updatedReviewData).forEach(([key, allRanks]) => {
          const avg =
            Math.round(
              allRanks.reduce(
                (sum: number, r: any) => sum + Number(r.rank || 0),
                0
              ) / allRanks.length
            ) || 0;
          merged[key] = { ...allRanks[0], rank: avg };
        });
        return merged;
      });
    }
  }, [activeTab]);

  if (!isAuthenticated) return null;

  // Load all tutor applications
  const rawApplications = JSON.parse(
    localStorage.getItem("tt-tutor-applications") || "[]"
  );

  const allApplications = rawApplications.flatMap((tutor: any) =>
    tutor.applications.map((app: any) => ({
      ...app,
      email: tutor.email,
      name: tutor.name,
    }))
  );

  // Apply filtering logic
  const filtered = allApplications.filter((app: any) => {
    const keywordInput = keyword.trim();
    const courseCodeMatch =
      keywordInput === "" || app.courseCode.includes(keywordInput);
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
      courseCodeMatch &&
      courseMatch &&
      tutorMatch &&
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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by Course Code (e.g., COSC2626)"
              className="flex-grow border border-purple-400 rounded px-4 py-2 text-sm text-purple-900 bg-white placeholder-purple-600"
            />
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Course Name"
              className="border border-purple-400 rounded px-4 py-2 text-sm text-purple-900 bg-white placeholder-purple-600"
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
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="border border-purple-400 rounded px-4 py-2 text-sm text-purple-900 bg-white"
            >
              <option value="">Availability</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
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
            allApplications={allApplications}
            reviewData={reviewData}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
