import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignInForm from "../src/components/SignInForm";

// Mocking the useRouter hook from Next.js to avoid real navigation during test
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(), // we’re just checking interaction, not actual routing
  }),
}));

describe("SignInForm accessibility", () => {
  // This test checks if the form inputs are accessible and usable via keyboard
  it("allows keyboard navigation and input", async () => {
    render(<SignInForm />);

    // Grab the email and password fields using their labels
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulate typing into both inputs
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "abcdef");

    // Make sure the input values are correctly updated
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("abcdef");
  });
});
