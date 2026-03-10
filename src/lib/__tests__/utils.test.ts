import { slugify, readingTime } from "../utils";

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles special characters", () => {
    expect(slugify("How to Learn React?")).toBe("how-to-learn-react");
  });
});

describe("readingTime", () => {
  it("returns at least 1 minute", () => {
    expect(readingTime("")).toBe(1);
  });

  it("calculates ~200 words per minute", () => {
    const words = Array(200).fill("word").join(" ");
    expect(readingTime(words)).toBe(1);
  });
});
