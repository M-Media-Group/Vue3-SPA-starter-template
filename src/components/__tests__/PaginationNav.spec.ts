import { describe, expect, it } from "vitest";

import { RouterLinkStub, mount } from "@vue/test-utils";
import PaginationNav from "../PaginationNav.vue";
import "html-validate/vitest";

describe("Pagination", () => {
  it("renders correctly by default", () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 100,
        resultsPerPage: 10,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const pagination = wrapper.find("nav");
    expect(pagination.exists()).toBe(true);

    // The first button is the "prev" page and it should be disabled
    const prevButton = wrapper.find("button");
    expect(prevButton.attributes("disabled")).toBe("");
    // The last button is the "next" page and it should not be disabled
    const nextButton = wrapper.find("button:last-of-type");
    expect(nextButton.attributes("disabled")).toBe(undefined);
    // The second button is the first page and it should also be disabled since we are on it
    const firstButton = wrapper.find("button:nth-of-type(2)");
    expect(firstButton.attributes("disabled")).toBe("");
    // There should be 10 pages
    const buttons = wrapper.findAll("button");
    // With the default of maxPages: 5, we should have 7 buttons (5 pages + prev + next)
    expect(buttons.length).toBe(7);

    // @ts-ignore
    // @ts-ignore an ambient declaration file doesnt seem to work to add toHTMLValidate @todo and check
    expect(wrapper.html()).toHTMLValidate();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("does not show duplicate pages", () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 30,
        resultsPerPage: 10,
        currentPage: 3,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // There should be 5 buttons
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(5);

    // None of the buttons should have the same text
    const texts = buttons.map((button) => button.text());
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("does not show duplicate pages", () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 300,
        resultsPerPage: 10,
        currentPage: 3,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // There should be 5 buttons
    const buttons = wrapper.findAll("button");

    // None of the buttons should have the same text
    const texts = buttons.map((button) => {
      // If its a "...", we skip it
      if (button.text() === "...") return;
      return button.text();
    });

    const textsSize = new Set(texts).size;
    expect(textsSize).toBe(texts.length);
  });

  it("does not show duplicate pages", () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 100,
        resultsPerPage: 10,
        currentPage: 10,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // There should be 7 buttons
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(7);

    // None of the buttons should have the same text
    const texts = buttons.map((button) => {
      // If its a "...", we skip it
      if (button.text() === "...") return;
      return button.text();
    });

    const textsSize = new Set(texts).size;
    expect(textsSize).toBe(texts.length);
  });

  it("does not show useless separators towards the end", () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 40,
        resultsPerPage: 10,
        currentPage: 1,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // There should be 7 buttons
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(6);

    // There should be no "..." in the buttons
    const texts = buttons.map((button) => button.text());
    expect(texts).not.toContain("...");
  });

  it("does not show useless separators towards the end", () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 50,
        resultsPerPage: 10,
        currentPage: 4,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // There should be 7 buttons
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(7);

    // There should be no "..." in the buttons
    const texts = buttons.map((button) => button.text());
    expect(texts).not.toContain("...");
  });

  it("does not show useless separators towards the start", () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 40,
        resultsPerPage: 10,
        currentPage: 4,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // There should be 7 buttons
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(6);

    // There should be no "..." in the buttons
    const texts = buttons.map((button) => button.text());
    expect(texts).not.toContain("...");
  });

  it("correctly renders really large page numbers", () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 1000000000,
        resultsPerPage: 10,
        currentPage: 500000,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // There should be 7 buttons
    const buttons = wrapper.findAll("button");

    // The second to last button is the last page - it should read "100,000,000"
    const lastButton = buttons[buttons.length - 2];
    expect(lastButton.text()).toBe("100,000,000");
  });

  it("emits the correct page when a button is clicked", async () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 100,
        resultsPerPage: 10,
        currentPage: 1,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const buttons = wrapper.findAll("button");
    // Go to page 3 button will have the text "3"
    const page3Button = buttons[3];
    await page3Button.trigger("click");
    expect(wrapper.emitted("update:currentPage")?.[0]).toEqual([3]);
  });

  it("emits the correct page when the next button is clicked", async () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 100,
        resultsPerPage: 10,
        currentPage: 1,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const nextButton = wrapper.find("button:last-of-type");
    await nextButton.trigger("click");
    expect(wrapper.emitted("update:currentPage")?.[0]).toEqual([2]);
  });

  it("emits the correct page when the previous button is clicked", async () => {
    const wrapper = mount(PaginationNav, {
      props: {
        totalItems: 100,
        resultsPerPage: 10,
        currentPage: 2,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const prevButton = wrapper.find("button");
    await prevButton.trigger("click");
    expect(wrapper.emitted("update:currentPage")?.[0]).toEqual([1]);
  });
});
