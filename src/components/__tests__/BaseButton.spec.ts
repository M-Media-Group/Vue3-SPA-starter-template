import { describe, expect, it } from "vitest";

import { RouterLinkStub, mount } from "@vue/test-utils";
import BaseButton from "../BaseButton.vue";

describe("Base Button", () => {
  it("renders as a link when an href attribute is set", () => {
    const wrapper = mount(BaseButton, {
      props: {
        href: "https://google.com",
      },

      slots: {
        default: "Click me",
      },
    });

    // Expect an anchor element to exist
    expect(wrapper.find("a").exists()).toBe(true);

    // Expect the anchor element to have the correct href
    expect(wrapper.find("a").attributes("href")).toBe("https://google.com");

    // Expect the anchor element to have the correct text
    expect(wrapper.find("a").text()).toBe("Click me");
  });

  it("renders as a router-link when to attribute is set", () => {
    const wrapper = mount(BaseButton, {
      props: {
        to: "/",
      },

      slots: {
        default: "Click me",
      },
    });

    // Expect a button element to exist
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe("/");

    // Expect the element to have the correct text
    expect(wrapper.findComponent(RouterLinkStub).text()).toBe("Click me");
  });

  it("renders as a button when no href or to attribute is set", () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: "Click me",
      },
    });

    // Expect a button element to exist
    expect(wrapper.find("button").exists()).toBe(true);

    // Expect the element to have the correct text
    expect(wrapper.find("button").text()).toBe("Click me");
  });

  it("renders as a button and passes type attribute", () => {
    const wrapper = mount(BaseButton, {
      props: {
        type: "submit",
      },

      slots: {
        default: "Click me",
      },
    });

    // Expect a button element to exist
    expect(wrapper.find("button").exists()).toBe(true);

    // Expect the element to have the correct text
    expect(wrapper.find("button").attributes("type")).toBe("submit");
  });
});
