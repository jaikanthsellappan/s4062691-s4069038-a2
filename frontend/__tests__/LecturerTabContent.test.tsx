import React from "react";
import { render, screen, within } from "@testing-library/react";
import LecturerTabContent from "../src/components/LecturerTabContent";

// Test to make sure the Visual Analysis tab correctly shows the top and bottom ranked tutors
describe("LecturerTabContent - Visual Analysis", () => {
  // These are the tutors who were selected by the lecturer
  const mockSelectedApps = [
    {
      name: "Alice",
      email: "alice@example.com",
      courseCode: "COSC1001",
      courseName: "AI",
    },
    {
      name: "Bob",
      email: "bob@example.com",
      courseCode: "COSC2002",
      courseName: "Cloud",
    },
  ];

  // Used for full table and unselected check
  const mockAllApplications = [...mockSelectedApps];

  beforeEach(() => {
    // Set up a mock logged-in lecturer
    const lecturerEmail = "lecturer1@example.com";
    localStorage.setItem(
      "tt-current-user",
      JSON.stringify({ email: lecturerEmail })
    );

    // Save mock review data for both selected tutors
    const reviewKey = `tt-review-data-${lecturerEmail}`;
    const reviewData = {
      "alice@example.com-COSC1001": { rank: "9", comment: "" },
      "bob@example.com-COSC2002": { rank: "4", comment: "" },
    };

    localStorage.setItem(reviewKey, JSON.stringify(reviewData));
  });

  // Clean up localStorage between tests
  afterEach(() => {
    localStorage.clear();
  });

  it("displays correct most and least selected tutors", () => {
    render(
      <LecturerTabContent
        activeTab="visual"
        paginated={[]}
        selectedApps={mockSelectedApps}
        allApplications={mockAllApplications}
        reviewData={{}}
        currentPage={1}
        totalPages={1}
        setCurrentPage={() => {}}
      />
    );

    // Check that the "Most Selected" card shows Alice (rank 9)
    const mostCard = screen.getByText("🥇 Most Selected").closest("div");
    expect(within(mostCard!).getByText("Alice")).toBeInTheDocument();
    expect(within(mostCard!).getByText(/COSC1001/i)).toBeInTheDocument();

    // Check that the "Least Selected" card shows Bob (rank 4)
    const leastCard = screen.getByText("🥈 Least Selected").closest("div");
    expect(within(leastCard!).getByText("Bob")).toBeInTheDocument();
    expect(within(leastCard!).getByText(/COSC2002/i)).toBeInTheDocument();
  });
});
