// Import the necessary functions and modules for testing
import {
  convertPercentToPixels,
  convertRemToPixels,
  getCssVarForStripe,
} from "../cssVariables";
import { beforeEach, describe, expect, it } from "vitest";

// Mock the getComputedStyle function
const mockGetComputedStyle = (value: string = "mocked value") => {
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (element: Element) =>
    ({
      getPropertyValue: (prop: string) => {
        return {
          "--test-variable": value,
        }[prop];
      },
      fontSize: "16px", // Mocking font size for testing purposes
    } as CSSStyleDeclaration);
  beforeEach(() => {
    window.getComputedStyle = originalGetComputedStyle;
  });
};

// Test suite for getCssVarForStripe function
describe("getCssVarForStripe function", () => {
  // Test case for handling CSS variable with percent value
  it("should convert percent value to pixels", () => {
    mockGetComputedStyle("100%");

    expect(getCssVarForStripe("test-variable")).toBe("16px");
  });

  it("should convert percent value to pixels correctly", () => {
    mockGetComputedStyle("50%");

    expect(getCssVarForStripe("test-variable")).toBe("8px");
  });

  it("should convert percent value to pixels to a max of 100%", () => {
    mockGetComputedStyle("150%");

    expect(getCssVarForStripe("test-variable")).toBe("16px");
  });

  // Test case for handling CSS variable with HSL color value
  it("should convert HSL color value to RGB", () => {
    mockGetComputedStyle("hsl(120, 100%, 50%)");
    expect(getCssVarForStripe("test-variable")).toBe("rgb(0,255,0)");
  });

  // Test case for handling other types of CSS variables
  it("should return the original computed value", () => {
    mockGetComputedStyle("10px");
    expect(getCssVarForStripe("test-variable")).toBe("10px");
  });
});

// Test suite for convertRemToPixels function
describe("convertRemToPixels function", () => {
  it("should convert rem value to pixels", () => {
    mockGetComputedStyle();
    expect(convertRemToPixels(2)).toBe(32);
  });
});

// Test suite for convertPercentToPixels function
describe("convertPercentToPixels function", () => {
  it("should convert percent value to pixels", () => {
    mockGetComputedStyle();
    expect(convertPercentToPixels(50)).toBe(8);
  });
  it("should convert percent value to pixels when the percent value is greater than 100", () => {
    mockGetComputedStyle();
    expect(convertPercentToPixels(100)).toBe(16);
    expect(convertPercentToPixels(150)).toBe(24);
  });
});
