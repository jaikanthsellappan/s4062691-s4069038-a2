import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "../api"; // Axios instance (make sure it's setup)

const SITE_KEY = "6LfJsxIrAAAAADRnyRLUfgop7CfeQ6_bPCUyyVaF";

export default function SignInForm() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!recaptchaToken) {
      setError("Please verify the reCAPTCHA.");
      return;
    }

    try {
      const res = await axios.post("/login", { email, password });

      const user = res.data.user;
      localStorage.setItem("tt-current-user", JSON.stringify(user));
      setSuccess(res.data.message || "Login successful!");

      // Redirect to the correct dashboard
      setTimeout(() => {
        if (user.role === "tutor") {
          router.push("/tutors");
        } else if (user.role === "lecturer") {
          router.push("/lecturers");
        } else {
          router.push("/");
        }
      }, 1000);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    }
  };

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
          placeholder="Enter 8 characters or more"
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
