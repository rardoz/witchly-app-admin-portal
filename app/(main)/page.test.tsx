import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home Page", () => {
  it("renders the home message", async () => {
    const HomePage = await Home();
    render(HomePage);

    const homeText = screen.getByText(
      "This will be a home page if we ever need one",
    );
    expect(homeText).toBeInTheDocument();
  });

  it("has the correct structure", async () => {
    const HomePage = await Home();
    render(HomePage);

    const container = screen.getByText(
      "This will be a home page if we ever need one",
    );
    expect(container.tagName.toLowerCase()).toBe("div");
  });
});
