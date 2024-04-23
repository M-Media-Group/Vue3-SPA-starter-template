import { describe, expect, it, vi } from "vitest";
import {
  type requiredEmits,
  type requiredProps,
  useMultiselect,
} from "../useMultiselect";

// Setup the spy on emit, so we can check if it was called
const emit = vi.spyOn(
  {
    emit: () => {},
  },
  "emit"
) as unknown as requiredEmits;

describe("useMultiselect", () => {
  // Mock props and emit function
  const props = {
    options: [
      { id: "1", render: "Option 1", disabled: false },
      { id: "2", render: "Option 2", disabled: true },
      { id: "3", render: "Option 3", disabled: false },
    ],
    displayKey: "render",
    multiple: true,
    modelValue: ["1"],
    modelKey: "id",
  } as requiredProps;

  it("should compute normalisedOptions correctly", async () => {
    const { normalisedOptions } = useMultiselect(props, emit);
    expect(normalisedOptions.value).toEqual([
      { id: "1", render: "Option 1", disabled: false },
      { id: "2", render: "Option 2", disabled: true },
      { id: "3", render: "Option 3", disabled: false },
    ]);
  });

  it("should compute selecteableOptions correctly", async () => {
    const { selecteableOptions } = useMultiselect(props, emit);
    expect(selecteableOptions.value).toEqual([
      { id: "1", render: "Option 1", disabled: false },
      { id: "3", render: "Option 3", disabled: false },
    ]);
  });

  it("should return correct label for an option", async () => {
    const { getLabel } = useMultiselect(props, emit);
    expect(getLabel({ id: "1", render: "Option 1", disabled: false })).toBe(
      "Option 1"
    );
  });

  it("should update modelValue correctly when a value is selected", async () => {
    const { updateModelValue } = useMultiselect(props, emit);
    updateModelValue("2", true);
    expect(emit).toHaveBeenCalledWith("update:modelValue", ["1", "2"]);
  });

  it("should update modelValue correctly when a value is unselected", async () => {
    const { updateModelValue } = useMultiselect(props, emit);
    updateModelValue("1", false);
    expect(emit).toHaveBeenCalledWith("update:modelValue", []);
  });
});
