import { render } from "@testing-library/react";

import RootLayout, { metadata } from "./layout";

describe("RootLayout", () => {
  it("has correct metadata export", () => {
    expect(metadata.title).toBe("Witchly App Admin Portal");
    expect(metadata.description).toBe(
      "Admin portal for managing Witchly application",
    );
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <RootLayout>
        <div>Child Content</div>
      </RootLayout>,
    );

    expect(getByText("Child Content")).toBeInTheDocument();
  });
});
