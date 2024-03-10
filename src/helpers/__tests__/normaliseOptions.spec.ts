import { describe, expect, it } from "vitest";

import {
  filterOptions,
  normaliseOptions,
  orderOptionsBySelectedFirst,
} from "../normaliseOptions";

describe("filterOptions Functions", () => {
  it("is performant with a large number of options", () => {
    const generatedOptions = Array.from({ length: 1000000 }, (_, i) => ({
      id: i,
      render: `Option ${i}`,
    }));
    const start = performance.now();
    const normalisedOptions = normaliseOptions(generatedOptions);
    const end = performance.now();
    expect(end - start).toBeLessThan(125);
    expect(normalisedOptions.length).toBe(1000000);

    // Try a filterOptions
    const start2 = performance.now();
    const filteredOptions = filterOptions(normalisedOptions, "Option 500000");
    const end2 = performance.now();
    expect(filteredOptions.length).toBe(1);
    expect(end2 - start2).toBeLessThan(125);

    // Try an orderOptionsBySelectedFirst
    const start3 = performance.now();
    const orderedOptions = orderOptionsBySelectedFirst(
      normalisedOptions,
      ["Option 500000"],
      "render"
    );
    const end3 = performance.now();
    expect(orderedOptions.length).toBe(1000000);
    expect(end3 - start3).toBeLessThan(50);
  });

  it("filters the options correctly", () => {
    const options = [
      {
        id: "1",
        render: "One",
      },
      {
        id: "2",
        render: "Two",
      },
      {
        id: "3",
        render: "Three",
      },
    ];
    const filteredOptions = filterOptions(options, "Two");
    expect(filteredOptions.length).toBe(1);
    expect(filteredOptions[0].render).toBe("Two");
  });

  it("orders the options correctly by selected first", () => {
    const options = [
      {
        id: "1",
        render: "One",
      },
      {
        id: "2",
        render: "Two",
      },
      {
        id: "3",
        render: "Three",
      },
      {
        id: "4",
        render: "a",
      },
      {
        id: "5",
        render: "z",
      },
      {
        id: "6",
        render: "1",
      },
      {
        id: "7",
        render: "1000",
      },
    ];

    // Expect the initial order to be the same as the input
    const initialOrder = orderOptionsBySelectedFirst(options, []);
    expect(initialOrder.map((o) => o.render)).toEqual([
      "One",
      "Two",
      "Three",
      "a",
      "z",
      "1",
      "1000",
    ]);

    // Expect the selected option to be first
    const selectedFirst = orderOptionsBySelectedFirst(options, ["2"], "id");
    expect(selectedFirst.map((o) => o.render)).toEqual([
      "Two",
      "One",
      "Three",
      "a",
      "z",
      "1",
      "1000",
    ]);
  });
});