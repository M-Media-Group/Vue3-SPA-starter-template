import { describe, expect, it, vi } from "vitest";

import { debounce } from "../debounce";

describe("Debounce Function", () => {
  it("uses the correct function params from the last call when debouncing", () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced(1);
    debounced(2);
    debounced(3);

    expect(fn).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(fn).not.toHaveBeenCalledWith(1);
    expect(fn).not.toHaveBeenCalledWith(2);
    expect(fn).toHaveBeenLastCalledWith(3);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("uses the correct function params from the last call when debouncing with leading edge", () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const debounced = debounce(fn, 300, true);

    debounced(1);
    debounced(2);
    debounced(3);

    expect(fn).toHaveBeenCalledTimes(1);

    vi.runAllTimers();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith(1);

    // It should be possible to call the function again
    debounced(4);

    vi.runAllTimers();

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(4);
  });
});
