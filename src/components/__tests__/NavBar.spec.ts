import { describe, it, expect, vi } from "vitest";

import { mount, RouterLinkStub } from "@vue/test-utils";

import { createTestingPinia } from "@pinia/testing";

import NavBar from "../NavBar.vue";
import { useUserStore } from "@/stores/user";

describe("NavBar", () => {
  it("renders properly when logged out", () => {
    const wrapper = mount(NavBar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    expect(wrapper.find("[aria-roledescription='logo']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Login");
    expect(wrapper.text()).toContain("Sign up");
  });
  it("renders properly when logged in", async () => {
    const wrapper = mount(NavBar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });
    const store = useUserStore(); // uses the testing pinia!
    store.isAuthenticated = true;

    // Await the nextTick
    await wrapper.vm.$nextTick();

    expect(wrapper.find("[aria-roledescription='logo']").exists()).toBe(true);
    expect(wrapper.text()).toContain("My Account");
    expect(wrapper.text()).toContain("Logout");
    expect(wrapper.text()).toContain("Settings");
  });
});
