import React from "react";
import Image from "next/image";

// This is the landing page users see when they first open the app.
// It gives a brief introduction to what TeachTeam is about.
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row items-center md:items-start max-w-5xl w-full">
        {/* Left section: Visual illustration */}
        <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
          <img
            src="https://plus.unsplash.com/premium_vector-1682298060847-5b103c8d5a0a?w=600&auto=format&fit=crop&q=60"
            alt="Team Illustration"
            className="w-full max-w-sm object-contain"
          />
        </div>

        {/* Right section: Welcome text */}
        <div className="w-full md:w-1/2 text-center md:text-left px-4">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Welcome to TeachTeam (TT)
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            TeachTeam is a simple recruitment system created by the School of
            Computer Science to make it easier to hire casual tutors. Tutors can
            apply for roles, and lecturers can easily browse, assess, and select
            applicants.
          </p>
          <p className="text-md text-gray-600">
            Use the top menu to log in and get started as either a Tutor or a
            Lecturer.
          </p>
        </div>
      </div>
    </div>
  );
}
