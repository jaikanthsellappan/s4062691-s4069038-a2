import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavbarLecturer from "@/components/NavbarLecturer";
import axios from "../api";  


// const courseList = [
//   { code: "COSC2758", name: "Full Stack Development" },
//   { code: "COSC2626", name: "Cloud Computing" },
//   { code: "COSC2631", name: "Programming Fundamentals" },
//   { code: "COSC2611", name: "Web Programming" },
//   { code: "COSC2407", name: "AI and Machine Learning" },
//   { code: "COSC1284", name: "Algorithms and Analysis" },
//   { code: "COSC2627", name: "Advanced Programming" },
// ];

export default function TutorsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  type Course = {
  code: string;
  name: string;
};

type Availability ={
  id: number;
  availability: string;
}

type Role ={
  id: number;
  role: string;
}

// List of available courses for tutors to apply 
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [availabilities, setAvailability] = useState<Availability[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await axios.get("/availableCourses");
      setCourseList(res.data);
    } catch (err) {
      alert("Failed to fetch courses");
    }
    try {
      const res = await axios.get("/availability");
      setAvailability(res.data);
    } catch (err) {
      alert("Failed to fetch availability");
    }
    try {
      const res = await axios.get("/roles");
      setRoles(res.data);
    } catch (err) {
      alert("Failed to fetch roles");
    }
  };

  fetchCourses();
}, []);


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
  // Handles form submission
const handleSubmit = async (e: any) => {
  e.preventDefault();
  setError("");

  // Validation
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

  // Validate availability value exists in options
  const validAvailability = availabilities.some(
    (a) => a.availability === form.availability
  );
  if (!validAvailability) {
    setError("Invalid availability option selected.");
    return;
  }

  // Validate role value exists in options
  const validRole = roles.some((r) => r.role === form.role);
  if (!validRole) {
    setError("Invalid role option selected.");
    return;
  }

  try {
    await axios.post("/tutor-application", {
      courseCode: selected?.code,
      courseName: selected?.name,
      role: form.role.trim(),
      availability: form.availability.trim(),
      previousRoles: form.previousRoles.split(",").map((s) => s.trim()),
      credentials: form.credentials.split(",").map((s) => s.trim()),
      skills: form.skills.split(",").map((s) => s.trim()),
      email: user.email,
    });

    alert("Application submitted successfully!");
    setForm({
      selectedCourse: "",
      availability: "",
      previousRoles: "",
      skills: "",
      credentials: "",
      role: "",
    });
  } catch (err: any) {
    if (err.response?.status === 409) {
      alert(err.response.data.message);
    } else {
      alert("Failed to submit application.");
    }
  }
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
            {roles.map((r) => (
                <option key={r.id} value={r.role}>
                  {r.role}
                </option>
            ))}
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
            {availabilities.map((a) => (
              <option key={a.id} value={a.availability}>
                {a.availability}
              </option>
            ))}
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
