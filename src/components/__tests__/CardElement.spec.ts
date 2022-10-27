import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import CardElement from "../CardElement.vue";

describe("HelloWorld", () => {
  it("renders properly without footer", () => {
    const wrapper = mount(CardElement, {
      props: {
        title: "Hello",
        subtitle: "subtitle",
        images: [
          {
            src: "https://picsum.photos/200/300",
            alt: "alt",
          },
        ],
      },
    });

    // Expect an article element to exist
    expect(wrapper.find("article").exists()).toBe(true);

    // Expect the texts to be present
    expect(wrapper.text()).toContain("Hello");
    expect(wrapper.text()).toContain("subtitle");

    // Expect an image to exist
    expect(wrapper.find("img").exists()).toBe(true);

    // Expect the image to have the correct src
    expect(wrapper.find("img").attributes("src")).toBe(
      "https://picsum.photos/200/300"
    );

    // There should be a header element in the article
    expect(wrapper.find("article").find("header").exists()).toBe(true);

    // There should be no footer since we didn't pass it into the slot
    expect(wrapper.find("footer").exists()).toBe(false);
  });

  it("shows a footer when one is passed", () => {
    const wrapper = mount(CardElement, {
      props: {
        title: "Hello",
        subtitle: "subtitle",
        images: [
          {
            src: "https://picsum.photos/200/300",
            alt: "alt",
          },
        ],
      },
      slots: {
        footer: "Footer",
      },
    });

    // There should be a footer since we pass it into the slot
    expect(wrapper.find("footer").exists()).toBe(true);

    // The footer should contain the text "Footer"
    expect(wrapper.find("footer").text()).toBe("Footer");
  });
});
