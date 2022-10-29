import { describe, it, expect } from "vitest";

import { mount, RouterLinkStub } from "@vue/test-utils";

import PageFooter from "../PageFooter.vue";

describe("NavBar", () => {
  it("renders properly", () => {
    const wrapper = mount(PageFooter, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    // There should be a select (for locales)
    expect(wrapper.find("select").exists()).toBe(true);
    // The select should have a name of locales
    expect(wrapper.find("select").attributes("name")).toBe("locales");
  });
});
