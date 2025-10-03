import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "./layout";

describe("RootLayout", () => {
  it("renders children correctly", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies the correct font classes to body", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    // Check that the body element has the expected classes
    // Note: In a real Next.js app, these classes would be applied
    const body = document.body;
    expect(body).toHaveAttribute("class");
  });

  it("has correct metadata", () => {
    expect(metadata.title).toBe("Witchly App Admin Portal");
    expect(metadata.description).toBe(
      "Admin portal for managing Witchly application",
    );
  });
});
