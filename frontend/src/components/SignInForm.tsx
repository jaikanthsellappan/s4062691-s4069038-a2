import React from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";

// Public reCAPTCHA site key (v2 checkbox version)
const SITE_KEY = "6LfJsxIrAAAAADRnyRLUfgop7CfeQ6_bPCUyyVaF";

export default function SignInForm() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Form state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // This function runs when the form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the page from reloading
    setError("");
    setSuccess("");

    // Make sure both fields are filled
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    // Require passwords to be 6 characters or more
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Make sure reCAPTCHA was completed
    if (!recaptchaToken) {
      setError("Please verify the reCAPTCHA.");
      return;
    }

    // Look for a matching user in localStorage
    const users = JSON.parse(localStorage.getItem("tt-users") || "[]");
    const matchedUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!matchedUser) {
      setError("Incorrect email or password.");
      return;
    }

    // Save the current user and show a success message
    localStorage.setItem("tt-current-user", JSON.stringify(matchedUser));
    setSuccess("✅ Login successful!");

    // Redirect to the correct dashboard after login
    setTimeout(() => {
      if (matchedUser.role === "tutor") {
        router.push("/tutors");
      } else if (matchedUser.role === "lecturer") {
        router.push("/lecturers");
      }
    }, 1000);
  };

  // Called when the user completes the reCAPTCHA
  const handleCaptchaChange = (token: string | null) => {
    if (token) setRecaptchaToken(token);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      {/* Email input field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Password input field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter 6 characters or more"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* CAPTCHA box */}
      <div className="flex justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={SITE_KEY}
          onChange={handleCaptchaChange}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        LOGIN
      </button>
    </form>
  );
}
