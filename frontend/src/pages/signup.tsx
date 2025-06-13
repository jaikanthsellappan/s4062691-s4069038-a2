// pages/signup.tsx
import React from "react";
import SignUpForm from "../components/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 to-purple-500">
      <div className="bg-white shadow-xl rounded-md flex overflow-hidden max-w-4xl w-full">
        {/* Left side: Sign-up form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
            Register
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-purple-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
          <SignUpForm />
        </div>

        {/* Right side: Illustration */}
        <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-4">
          <img
            src="https://plus.unsplash.com/premium_vector-1682305452176-1dcef4a13bee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2Zlc3NvcnxlbnwwfHwwfHx8MA%3D%3D"
            alt="Sign Up Illustration"
            className="w-full h-auto object-contain rounded"
          />
        </div>
      </div>
    </div>
  );
}
