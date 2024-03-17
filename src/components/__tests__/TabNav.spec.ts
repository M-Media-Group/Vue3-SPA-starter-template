import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import TabNav from "../TabNav.vue";
import "html-validate/vitest";

describe("Tab navigation", () => {
  it("renders correctly by default", () => {
    const wrapper = mount(TabNav, {
      props: {
        options: [
          { render: "Page 1", id: "1" },
          { render: "Page 2", id: "2" },
          { render: "Page 3", id: "3" },
          { render: "Page 4", id: "4" },
          { render: "Page 5", id: "5" },
        ],
        modelValue: [],
      },
    });

    const tabNav = wrapper.find("nav");
    expect(tabNav.exists()).toBe(true);

    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(5);

    // Each text should be visible
    let i = 1;
    for (const button of buttons) {
      expect(button.text()).toBe("Page " + i++);
      //   No button should have an active class
      expect(button.classes("active")).toBe(false);
    }

    // @ts-ignore
    expect(wrapper.html()).toHTMLValidate();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("shows disabled tabs if a disabled tab is passed", () => {
    const wrapper = mount(TabNav, {
      props: {
        options: [
          { render: "Page 1", id: "1" },
          { render: "Page 2", id: "2" },
          { render: "Page 3", id: "3" },
          { render: "Page 4", id: "4", disabled: true },
          { render: "Page 5", id: "5" },
        ],
        modelValue: [],
      },
    });

    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(5);

    // The fourth button should be disabled
    const fourthButton = buttons[3];
    expect(fourthButton.attributes("disabled")).toBe("");

    // Expect the other buttons not to be disabled
    for (let i = 0; i < 5; i++) {
      if (i !== 3) {
        expect(buttons[i].attributes("disabled")).toBe(undefined);
      }
    }
  });
});
