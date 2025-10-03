import { metadata } from "./layout";

describe("RootLayout", () => {
  it("has correct metadata export", () => {
    expect(metadata.title).toBe("Witchly App Admin Portal");
    expect(metadata.description).toBe(
      "Admin portal for managing Witchly application",
    );
  });
});
