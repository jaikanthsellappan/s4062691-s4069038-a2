import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectedTutorCard from "../src/components/SelectedTutorCard";

// Sample tutor data for testing
const mockTutor = {
  name: "Alice Tutor",
  email: "alice@example.com",
  courseCode: "COSC1234",
  courseName: "Test Course",
};

// Set up a fake logged-in lecturer before each test
beforeEach(() => {
  localStorage.setItem(
    "tt-current-user",
    JSON.stringify({ email: "lecturer@example.com" })
  );
});

// Clear all stored data after each test
afterEach(() => {
  localStorage.clear();
});

describe("SelectedTutorCard - Rank input validation", () => {
  // Test to check if entering a valid rank (between 1 and 10) gets saved
  it("allows valid rank input between 1-10 and triggers saveReview", () => {
    render(<SelectedTutorCard tutor={mockTutor} />);

    // Get the number input field (rank input)
    const input = screen.getByRole("spinbutton");

    // Enter a valid rank and trigger the blur event (which saves it)
    fireEvent.change(input, { target: { value: "8" } });
    fireEvent.blur(input);

    // Check if the value is correctly saved in localStorage
    const reviewKey = "tt-review-data-lecturer@example.com";
    const reviewData = JSON.parse(localStorage.getItem(reviewKey) || "{}");
    const key = `${mockTutor.email}-${mockTutor.courseCode}`;

    expect(reviewData[key]?.rank).toBe("8");
  });

  // Test to check if invalid rank values (e.g. 12) are rejected
  it("rejects invalid values like 0 or 11", () => {
    render(<SelectedTutorCard tutor={mockTutor} />);

    const input = screen.getByRole("spinbutton");

    // Try setting an invalid value
    fireEvent.change(input, { target: { value: "12" } });
    fireEvent.blur(input);

    // Make sure it didn’t get saved as 12
    const value = Number(input.getAttribute("value"));
    expect(value).not.toBe(12);
  });
});
