import { describe, it, expect } from "vitest";

import { mount, RouterLinkStub } from "@vue/test-utils";
import NavBar from "../NavBar.vue";

describe("NavBar", () => {
  it("renders properly", () => {
    const wrapper = mount(NavBar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    expect(wrapper.text()).toContain("Scan");
    expect(wrapper.text()).toContain("Paddle");
    expect(wrapper.text()).toContain("Login");
    expect(wrapper.text()).toContain("Sign Up");
  });
});
