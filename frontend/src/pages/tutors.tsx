import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavbarLecturer from "@/components/NavbarLecturer";

// List of available courses for tutors to apply to
const courseList = [
  { code: "COSC2758", name: "Full Stack Development" },
  { code: "COSC2626", name: "Cloud Computing" },
  { code: "COSC2631", name: "Programming Fundamentals" },
  { code: "COSC2611", name: "Web Programming" },
  { code: "COSC2407", name: "AI and Machine Learning" },
  { code: "COSC1284", name: "Algorithms and Analysis" },
  { code: "COSC2627", name: "Advanced Programming" },
];

export default function TutorsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Initialize form fields
  const [form, setForm] = useState({
    selectedCourse: "",
    availability: "",
    previousRoles: "",
    skills: "",
    credentials: "",
    role: "",
  });

  const [error, setError] = useState("");

  // Check if the tutor is signed in
  useEffect(() => {
    const userData = localStorage.getItem("tt-current-user");
    if (!userData) {
      alert("Please sign in first.");
      router.push("/signin");
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handles form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");

    // Validation: make sure required fields are filled
    if (
      !form.selectedCourse ||
      !form.availability ||
      !form.skills ||
      !form.credentials ||
      !form.role
    ) {
      setError("Please fill all the required fields.");
      return;
    }

    const selected = courseList.find((c) => c.code === form.selectedCourse);
    if (!selected) {
      setError("Invalid course selected.");
      return;
    }

    const existing = localStorage.getItem("tt-tutor-applications");
    const all = existing ? JSON.parse(existing) : [];

    // Check if the tutor already exists in localStorage
    const existingTutor = all.find((t: any) => t.email === user.email);

    if (existingTutor) {
      // Prevent duplicate course application
      const alreadyApplied = existingTutor.applications.some(
        (app: any) => app.courseCode === form.selectedCourse
      );

      if (alreadyApplied) {
        alert("You have already submitted an application for this course.");
        // Reset form after attempt
        setForm({
          selectedCourse: "",
          availability: "",
          previousRoles: "",
          skills: "",
          credentials: "",
          role: "",
        });
        return;
      }

      // Add new application
      const newApplication = {
        courseCode: selected?.code || "",
        courseName: selected?.name || "",
        role: form.role,
        availability: form.availability,
        previousRoles: form.previousRoles.split(",").map((s) => s.trim()),
        credentials: form.credentials.split(",").map((s) => s.trim()),
        skills: form.skills.split(",").map((s) => s.trim()),
        name: user.name,
        email: user.email,
      };

      existingTutor.applications.push(newApplication);

      // Update the tutor's record in localStorage
      const updated = all.filter((t: any) => t.email !== user.email);
      updated.push(existingTutor);
      localStorage.setItem("tt-tutor-applications", JSON.stringify(updated));
    } else {
      // First-time application entry
      const tutorApp = {
        email: user.email,
        name: user.name,
        applications: [
          {
            courseCode: selected?.code || "",
            courseName: selected?.name || "",
            role: form.role,
            availability: form.availability,
            previousRoles: form.previousRoles.split(",").map((s) => s.trim()),
            credentials: form.credentials.split(",").map((s) => s.trim()),
            skills: form.skills.split(",").map((s) => s.trim()),
            name: user.name,
            email: user.email,
          },
        ],
        selections: [],
      };

      all.push(tutorApp);
      localStorage.setItem("tt-tutor-applications", JSON.stringify(all));
    }

    alert("Your application has been submitted successfully!");

    // Clear form fields after submission
    setForm({
      selectedCourse: "",
      availability: "",
      previousRoles: "",
      skills: "",
      credentials: "",
      role: "",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-purple-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-purple-800 mb-6">
        Welcome, {user.name || "Tutor"}!
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-4xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-purple-700">
          Tutor Application Form
        </h2>

        {error && <p className="text-red-600">{error}</p>}

        {/* Course selection dropdown */}
        <div>
          <label className="block font-semibold text-purple-700 mb-1">
            Select Course
          </label>
          <select
            value={form.selectedCourse}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, selectedCourse: e.target.value }))
            }
            className="w-full border p-2 rounded bg-white text-black"
          >
            <option value="">-- Select a Course --</option>
            {courseList.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role selection */}
        <div>
          <label className="block font-semibold text-purple-700 mb-1">
            Role for the Selected Course
          </label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, role: e.target.value }))
            }
            className="w-full border p-2 rounded bg-white text-black"
          >
            <option value="">-- Apply as a --</option>
            <option value="Tutor">Tutor</option>
            <option value="Lab Assistant">Lab Assistant</option>
            <option value="Both">Both</option>
          </select>
        </div>

        {/* Availability selection */}
        <div>
          <label className="block font-semibold text-purple-700 mb-1">
            Availability
          </label>
          <select
            value={form.availability}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, availability: e.target.value }))
            }
            className="w-full border p-2 rounded bg-white text-black"
          >
            <option value="">Select Availability</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
          </select>
        </div>

        {/* Previous roles input */}
        <div>
          <label className="block font-semibold text-purple-700 mb-1">
            Previous Roles
          </label>
          <input
            type="text"
            placeholder="e.g. Data Science, TA, Lab Assistant"
            className="w-full border p-2 rounded bg-white text-black"
            value={form.previousRoles}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, previousRoles: e.target.value }))
            }
          />
        </div>

        {/* Academic credentials input */}
        <div>
          <label className="block font-semibold text-purple-700 mb-1">
            Academic Credentials
          </label>
          <input
            type="text"
            placeholder="e.g. MS in IT, Bachelor of Computer Science"
            className="w-full border p-2 rounded bg-white text-black"
            value={form.credentials}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, credentials: e.target.value }))
            }
          />
        </div>

        {/* Skills input */}
        <div>
          <label className="block font-semibold text-purple-700 mb-1">
            Skills
          </label>
          <input
            type="text"
            placeholder="e.g. Java, C#, PHP"
            className="w-full border p-2 rounded bg-white text-black"
            value={form.skills}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, skills: e.target.value }))
            }
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
