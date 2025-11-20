import { render, screen } from "@testing-library/react";
import Dashboard from "./page";

describe("Dashboard Page", () => {
  it("renders the dashboard message", () => {
    render(<Dashboard />);

    const dashboardText = screen.getByText(
      "This will be a home page if we ever need one",
    );
    expect(dashboardText).toBeInTheDocument();
  });

  it("has the correct structure", () => {
    render(<Dashboard />);

    const container = screen.getByText(
      "This will be a home page if we ever need one",
    );
    expect(container.tagName.toLowerCase()).toBe("div");
  });
});
