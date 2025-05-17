import React from "react";
import SignInForm from "@/components/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 to-purple-500">
      <div className="bg-white shadow-xl rounded-md flex overflow-hidden max-w-4xl w-full">
        {/* The left side contains the login form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Login</h2>
          <p className="text-sm text-gray-600 mb-6">
            Don’t have an account yet?{" "}
            <span
              className="text-purple-600 font-medium cursor-pointer"
              onClick={(e) => e.preventDefault()}
            >
              Sign Up
            </span>
          </p>
          <SignInForm />
        </div>

        {/* The right side displays a visual illustration, only on larger screens */}
        <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-4">
          <img
            src="https://plus.unsplash.com/premium_vector-1683134311669-efed56570b2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDh8fHxlbnwwfHx8fHw%3D"
            alt="Login Illustration"
            className="w-full h-auto object-contain rounded"
          />
        </div>
      </div>
    </div>
  );
}
