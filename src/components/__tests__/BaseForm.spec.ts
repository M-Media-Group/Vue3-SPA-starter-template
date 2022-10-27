import { describe, it, expect } from "vitest";

import { mount, RouterLinkStub } from "@vue/test-utils";
import BaseForm from "../../forms/BaseForm.vue";

describe("Base Button", () => {
  it("renders a form element", () => {
    const wrapper = mount(BaseForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // Expect a form element to exist
    expect(wrapper.find("form").exists()).toBe(true);

    // Expect the form element to have no inputs
    expect(wrapper.find("input").exists()).toBe(false);

    // Expect there to be a submit button
    expect(wrapper.find("button").exists()).toBe(true);

    // The submit button should have a type set to submit
    expect(wrapper.find("button").attributes("type")).toBe("submit");
  });

  it("renders the submit text correctly", () => {
    const wrapper = mount(BaseForm, {
      props: {
        submitText: "Submit",
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // Expect the submit button to have the correct text
    expect(wrapper.find("button").text()).toBe("Submit");
  });

  it("accepts inputs in its default slot", () => {
    const wrapper = mount(BaseForm, {
      slots: {
        default: `
          <input type="text" />
          <input type="text" />
        `,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // Expect the form element to have two inputs
    expect(wrapper.findAll("input").length).toBe(2);
  });

  it("emits a submit event when submitted", () => {
    const wrapper = mount(BaseForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // The submit button should not be disabled
    // @todo, according the the HTML spec the attribute shouldnt even exist on the element
    expect(wrapper.find("button").attributes("disabled")).toBeFalsy();
    // expect(wrapper.find("button").attributes("disabled")).toBeUndefined();

    // Submit the form
    wrapper.find("form").trigger("submit");

    // Expect the form to have emitted a submit event
    expect(wrapper.emitted("submit")).toBeTruthy();
  });

  it("emits a submit event when submitted via enter key", () => {
    const wrapper = mount(BaseForm, {
      slots: {
        default: `
          <input type="text" />
        `,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    // Submit the form with a keydown enter event
    wrapper.find("input").trigger("keydown.enter");

    // Expect the form to have emitted a submit event
    expect(wrapper.emitted("submit")).toBeTruthy();
  });

  // There is currently some issue with test-utils not emitting events on clicks, see https://stackoverflow.com/questions/53382235/trigger-form-submit-on-button-click-in-vue-unit-test
  it.skip("emits a submit event when submitted via submit button", () => {
    const wrapper = mount(BaseForm, {
      slots: {
        default: `
          <input type="text" />
        `,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    // Submit the form with a keydown enter event
    wrapper.find("button").trigger("click");

    // Expect the form to have emitted a submit event
    expect(wrapper.emitted("submit")).toBeTruthy();
  });

  it("does not submit if form is invalid", () => {
    const wrapper = mount(BaseForm, {
      slots: {
        default: `
          <input type="text" required />
        `,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    // Expect the submit button to be disabled
    expect(wrapper.find("button").attributes("disabled")).toBeDefined();

    // Submit the form
    wrapper.find("form").trigger("submit");

    // Expect the form to have emitted a submit event
    expect(wrapper.emitted("submit")).toBeFalsy();
  });
});
