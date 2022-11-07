import { describe, it, expect } from "vitest";

import { mount, RouterLinkStub } from "@vue/test-utils";
import BaseModal from "../BaseModal.vue";

describe("Base Modal", () => {
  // Globally stub the router-link component
  const globalStubs = {
    RouterLink: RouterLinkStub,
  };

  it("renders a modal element", () => {
    const wrapper = mount(BaseModal, {
      props: {
        title: "Test Title",
      },
      global: {
        stubs: globalStubs,
      },
    });

    // Expect a dialog element to exist with the open attribute
    expect(wrapper.find("dialog").exists()).toBe(true);

    // Expect a article element to exist within the dialog element
    expect(wrapper.find("dialog article").exists()).toBe(true);

    // By default, the modal should not be open
    expect(wrapper.find("dialog").attributes("open")).toBe(undefined);
  });

  it("opens a modal when trigger clicked", async () => {
    const wrapper = mount(BaseModal, {
      props: {
        title: "Test Title",
      },
      global: {
        stubs: globalStubs,
      },
    });

    // Click the modal to open it
    await wrapper.find("button").trigger("click");

    // Expect the modal to be open
    expect(wrapper.find("dialog").attributes("open")).toBe("");
  });

  it("renders a title when a title prop is passed", () => {
    const wrapper = mount(BaseModal, {
      props: {
        title: "Test Title",
      },
      global: {
        stubs: globalStubs,
      },
    });

    // Expect the title to be rendered within the article element
    expect(wrapper.find("article").text()).toContain("Test Title");
  });

  it("shows a footer with a button", () => {
    const wrapper = mount(BaseModal, {
      props: {
        title: "Test Title",
      },
      global: {
        stubs: globalStubs,
      },
    });

    // There should be a footer
    expect(wrapper.find("footer").exists()).toBe(true);

    // There should be at least 1 button in the footer (usually the cancel/close)
    expect(
      wrapper.find("footer").findAll("button").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("shows a close button in the header", () => {
    const wrapper = mount(BaseModal, {
      props: {
        title: "Test Title",
      },
      global: {
        stubs: globalStubs,
      },
    });

    // There should be an element in the header with data-target set
    expect(wrapper.find("header [data-target]").exists()).toBe(true);
  });

  it("closes the modal when the close button is clicked", async () => {
    const wrapper = mount(BaseModal, {
      props: {
        title: "Test Title",
      },
      global: {
        stubs: globalStubs,
      },
    });

    // Click the modal to open it
    await wrapper.find("button").trigger("click");

    // Click the close button
    await wrapper.find("header [data-target]").trigger("click");

    // Wait for the modal to close (transition - 0.5 second)
    await new Promise((r) => setTimeout(r, 500));

    // Expect the modal to be closed
    await expect(wrapper.find("dialog").attributes("open")).toBe(undefined);
  });

  it("does not show a close button in the header when prop showCloseInHeader is false", () => {
    const wrapper = mount(BaseModal, {
      props: {
        title: "Test Title",
        showCloseInHeader: false,
      },
      global: {
        stubs: globalStubs,
      },
    });

    // There should be an element in the header with data-target set
    expect(wrapper.find("header [data-target]").exists()).toBe(false);
  });
});