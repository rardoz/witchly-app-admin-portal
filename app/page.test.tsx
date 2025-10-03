import { render, screen } from "@testing-library/react";
import Dashboard from "./page";

describe("Dashboard Page", () => {
  it("renders the dashboard message", () => {
    render(<Dashboard />);

    const dashboardText = screen.getByText("This will be the admin dashboard");
    expect(dashboardText).toBeInTheDocument();
  });

  it("has the correct structure", () => {
    render(<Dashboard />);

    const container = screen.getByText("This will be the admin dashboard");
    expect(container.tagName.toLowerCase()).toBe("div");
  });
});
