import React from "react";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // This block runs only once when the app loads
    // It checks whether any users already exist in localStorage
    const existingUsers = localStorage.getItem("tt-users");

    // If not found, it adds a set of hardcoded users (4 tutors and 4 lecturers)
    if (!existingUsers) {
      const dummyUsers = [
        // Tutor accounts
        {
          email: "tutor1@tt.com",
          password: "Tutor@123",
          name: "john",
          role: "tutor",
        },
        {
          email: "tutor2@tt.com",
          password: "Tutor@123",
          name: "mike",
          role: "tutor",
        },
        {
          email: "tutor3@tt.com",
          password: "Tutor@123",
          name: "alex",
          role: "tutor",
        },
        {
          email: "tutor4@tt.com",
          password: "Tutor@123",
          name: "james",
          role: "tutor",
        },
        // Lecturer accounts
        {
          email: "lecturer1@tt.com",
          password: "Lecturer@123",
          role: "lecturer",
        },
        {
          email: "lecturer2@tt.com",
          password: "Lecturer@123",
          role: "lecturer",
        },
        {
          email: "lecturer3@tt.com",
          password: "Lecturer@123",
          role: "lecturer",
        },
        {
          email: "lecturer4@tt.com",
          password: "Lecturer@123",
          role: "lecturer",
        },
      ];

      // Save the hardcoded user list to localStorage for login validation
      localStorage.setItem("tt-users", JSON.stringify(dummyUsers));
      console.log("✅ Dummy users stored in localStorage.");
    }
  }, []);

  // Wrap every page in the custom Layout (with header, navbar, and footer)
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
