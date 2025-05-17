import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../src/pages/index";

describe("HomePage", () => {
  it("shows welcome message and description", () => {
    // Renders the home page component
    render(<HomePage />);

    // Check if the main heading is visible
    expect(
      screen.getByText(/Welcome to TeachTeam \(TT\)/i)
    ).toBeInTheDocument();

    // Check if the description about the recruitment system is present
    expect(
      screen.getByText((content) =>
        content.includes("TeachTeam is a simple recruitment system")
      )
    ).toBeInTheDocument();

    // Check for the login instruction sentence
    expect(
      screen.getByText((content) =>
        content.includes(
          "log in and get started as either a Tutor or a Lecturer"
        )
      )
    ).toBeInTheDocument();
  });
});
