import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import BaseModal from "../BaseModal.vue";

describe("Confirms Middleware", () => {
  it("renders a confirmation element", () => {
    const wrapper = mount(BaseModal, {
      props: {
        title: "Test Title",
        middleware: "auth",
      },
      slots: {
        default: "<button name=test>Click me</button>",
      },
    });

    // Expect a dialog element to exist with the open attribute
    expect(wrapper.find("dialog").exists()).toBe(true);

    // Expect a article element to exist within the dialog element
    expect(wrapper.find("dialog article").exists()).toBe(true);

    // By default, the modal should not be open
    expect(wrapper.find("dialog").attributes("open")).toBe(undefined);

    // There should be a button element
    expect(wrapper.find("button[name=test]").exists()).toBe(true);
  });
});
