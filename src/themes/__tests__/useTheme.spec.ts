import { beforeEach, describe, expect, it } from "vitest";

import { getCurrentTheme, setBestGuessTheme, setTheme } from "../useTheme"; // Assuming this is the correct path to your module

// We need to get jest to mock the window.matchMedia function

describe("Theme functionality", () => {
  beforeEach(() => {
    // Reset localStorage and document theme attribute before each test
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("should set and get dark mode correctly", () => {
    setTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toEqual("dark");
    expect(localStorage.getItem("theme")).toEqual("dark");
    expect(getCurrentTheme()).toEqual("dark");

    setTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toEqual(
      "light"
    );
    expect(localStorage.getItem("theme")).toEqual("light");
    expect(getCurrentTheme()).toEqual("light");

    setTheme("system");
    // data-theme should be removed when set to system
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();
    expect(localStorage.getItem("theme")).toEqual("system");
    expect(getCurrentTheme()).toEqual("system");
  });

  it("should set best guess theme correctly", () => {
    // Ensure localStorage is empty
    expect(localStorage.getItem("theme")).toBeNull();

    // Simulate no localStorage or document theme attribute set
    setBestGuessTheme();
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();
    expect(localStorage.getItem("theme")).toEqual("system");

    // Simulate localStorage set
    localStorage.setItem("theme", "dark");
    setBestGuessTheme();
    expect(document.documentElement.getAttribute("data-theme")).toEqual("dark");
    expect(localStorage.getItem("theme")).toEqual("dark");

    // Simulate document theme attribute set
    // Remove localStorage
    localStorage.removeItem("theme");
    document.documentElement.setAttribute("data-theme", "light");
    setBestGuessTheme();
    expect(document.documentElement.getAttribute("data-theme")).toEqual(
      "light"
    );
    expect(localStorage.getItem("theme")).toEqual("light");
  });
});
