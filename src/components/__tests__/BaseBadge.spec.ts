import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import BaseBadge from "../BaseBadge.vue";

describe("BaseBadge", () => {
  it("renders properly", () => {
    const wrapper = mount(BaseBadge);
    // There should be an element with the role of status
    expect(wrapper.find("[role=status]").exists()).toBe(true);
    expect(wrapper.classes("outline")).toBe(false);
  });
  it("accepts a string input in its slot", () => {
    const wrapper = mount(BaseBadge, {
      slots: {
        default: "Hello",
      },
    });
    // The slot should be rendered
    expect(wrapper.text()).toBe("Hello");
  });
  it("accepts a class name", () => {
    const wrapper = mount(BaseBadge, {
      props: {
        className: "outline",
      },
    });
    // The class name should be applied
    expect(wrapper.classes("outline")).toBe(true);
  });
});
