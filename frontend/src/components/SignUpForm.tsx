import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "../api";

export default function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    setPasswordStrength(score);

    if (score <= 2) setStrengthLabel("Weak");
    else if (score === 3 || score === 4) setStrengthLabel("Medium");
    else setStrengthLabel("Strong");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.firstName || !form.email || !form.password || !form.role) {
      setError("Please fill in all required fields.");
      return;
    }
    //  Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Block weak passwords with strong regex
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!strongPasswordRegex.test(form.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      await axios.post("/register", form);
      setSuccess("✅ Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          name="firstName"
          type="text"
          value={form.firstName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          name="lastName"
          type="text"
          value={form.lastName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm text-gray-800"
        />
        {/* Password strength bar + label */}
        <div className="mt-1">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className={`h-full rounded transition-all duration-300 ${
                passwordStrength <= 2
                  ? "bg-red-500 w-1/3"
                  : passwordStrength <= 4
                  ? "bg-yellow-500 w-2/3"
                  : "bg-green-500 w-full"
              }`}
            ></div>
          </div>
          <p
            className={`text-xs mt-1 font-medium ${
              passwordStrength <= 2
                ? "text-red-600"
                : passwordStrength <= 4
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {strengthLabel} password
          </p>
        </div>
        <small className="text-gray-500 text-xs">
          Must be 8+ characters with uppercase, lowercase, number, and symbol.
        </small>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm text-gray-800"
        >
          <option value="">-- Select Role --</option>
          <option value="tutor">Tutor</option>
          <option value="lecturer">Lecturer</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        REGISTER
      </button>
    </form>
  );
}
