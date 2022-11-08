import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import CardElement from "../CardElement.vue";

describe("Card element", () => {
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

  it("shows a card title when one is passed", () => {
    const wrapper = mount(CardElement, {
      props: {
        title: "Hello",
      },
    });

    // There should be a title since we pass it into the props. Find the text
    // inside the header element
    expect(wrapper.find("header").text()).toContain("Hello");
  });

  it("shows a card subtitle when one is passed", () => {
    const wrapper = mount(CardElement, {
      props: {
        title: "Hello",
        subtitle: "subtitle",
      },
    });

    // There should be a title since we pass it into the props. Find the text
    // inside the header element
    expect(wrapper.find("header").text()).toContain("subtitle");
  });

  it("shows images when passed", () => {
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

    // There should be an image since we pass it into the props. Find the image
    // inside the wrapper
    expect(wrapper.find("img").exists()).toBe(true);

    // The image should have the correct src
    expect(wrapper.find("img").attributes("src")).toBe(
      "https://picsum.photos/200/300"
    );
  });

  it("shows body content when passed to default slot", () => {
    const wrapper = mount(CardElement, {
      props: {
        title: "Hello",
        subtitle: "subtitle",
      },
      slots: {
        default: "Body content",
      },
    });

    // There should be a body since we pass it into the
    // default slot. Find the text inside the wrapper
    expect(wrapper.text()).toContain("Body content");
  });

  it("shows headerActions when that slot is passed", () => {
    const wrapper = mount(CardElement, {
      props: {
        title: "Hello",
        subtitle: "subtitle",
      },
      slots: {
        headerActions: "Header actions",
      },
    });

    // There should be a headerActions since we pass it into the
    // headerActions slot. Find the text inside the wrapper
    expect(wrapper.text()).toContain("Header actions");
  });
});
