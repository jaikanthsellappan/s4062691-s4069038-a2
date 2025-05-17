import React from "react";
import { render } from "@testing-library/react";
import TutorsPage from "../src/pages/tutors";

// We mock Next.js useRouter so the app doesn't actually try to navigate during testing
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(), // we just check if push is called, no real redirect
  }),
}));

// Set up a fake window.alert function so it doesn't throw an error during the test
beforeAll(() => {
  global.alert = jest.fn();
});

describe("TutorsPage redirect", () => {
  it("shows an alert if user tries to access tutor page without logging in", () => {
    // Simulate no user being logged in
    localStorage.clear();

    // Render the TutorsPage component
    render(<TutorsPage />);

    // Check that the alert was triggered
    expect(global.alert).toHaveBeenCalledWith("Please sign in first.");
  });
});
