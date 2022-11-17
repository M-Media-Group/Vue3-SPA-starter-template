import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import PageFooter from "../PageFooter.vue";

describe("NavBar", () => {
  it("renders properly", () => {
    const wrapper = mount(PageFooter);
    // There should be a select (for locales)
    expect(wrapper.find("[name=locales]").exists()).toBe(true);
  });
  it("shows a select for dark mode toggling", () => {
    const wrapper = mount(PageFooter);
    // There should be a select (for dark mode)
    expect(wrapper.find("[name=dark-mode]").exists()).toBe(true);
  });
});
