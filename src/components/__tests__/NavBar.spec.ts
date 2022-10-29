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
    expect(wrapper.text()).toContain("Scan");
    expect(wrapper.text()).toContain("Paddle");
    expect(wrapper.text()).toContain("Login");
    expect(wrapper.text()).toContain("Sign Up");
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
      props: {
        loggedIn: true,
      },
    });
    const store = useUserStore(); // uses the testing pinia!
    store.isAuthenticated = true;

    // Await the nextTick
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Scan");
    expect(wrapper.text()).toContain("Paddle");
    expect(wrapper.text()).toContain("My Account");
    expect(wrapper.text()).toContain("Logout");
    expect(wrapper.text()).toContain("Settings");
  });
});
