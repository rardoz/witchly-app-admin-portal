import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "./layout";

describe("RootLayout", () => {
  it("renders children correctly", () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
    // Verify the HTML structure
    expect(container.querySelector("html")).toBeInTheDocument();
    expect(container.querySelector("body")).toBeInTheDocument();
  });

  it("applies the correct font classes", () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    const body = container.querySelector("body");
    expect(body).toHaveClass("antialiased");
  });

  it("has correct metadata", () => {
    expect(metadata.title).toBe("Witchly App Admin Portal");
    expect(metadata.description).toBe(
      "Admin portal for managing Witchly application",
    );
  });
});
