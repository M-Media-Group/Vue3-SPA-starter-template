import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import BaseForm from "../BaseForm.vue";

describe("Base Form", () => {
  it("renders a form element", () => {
    const wrapper = mount(BaseForm);

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
    });

    // Expect the form element to have two inputs
    expect(wrapper.findAll("input").length).toBe(2);
  });

  it("emits a submit event when submitted", () => {
    const wrapper = mount(BaseForm);
    // Submit the form
    wrapper.find("form").trigger("submit");

    // Expect the form to have emitted a submit event
    expect(wrapper.emitted("submit")).toBeTruthy();
  });

  it("prevents submission when isLoading", () => {
    const wrapper = mount(BaseForm, {
      props: {
        isLoading: true,
      },
    });
    // Submit the form
    wrapper.find("form").trigger("submit");

    // Expect the form to have emitted a submit event
    expect(wrapper.emitted("submit")).toBeFalsy();
  });

  it("emits a submit event when submitted via enter key", () => {
    const wrapper = mount(BaseForm, {
      slots: {
        default: `
          <input type="text" />
        `,
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
    });

    // Expect the submit button to be disabled
    expect(wrapper.find("button").attributes("disabled")).toBeDefined();

    // Submit the form
    wrapper.find("form").trigger("submit");

    // Expect the form to have emitted a submit event
    expect(wrapper.emitted("submit")).toBeFalsy();
  });

  it("disables the submit button when the disabled attribute is passed", () => {
    const wrapper = mount(BaseForm, {
      props: {
        disabled: true,
      },
    });

    // Expect the submit button to be disabled
    expect(wrapper.find("button").attributes("disabled")).toBeDefined();
  });

  it("disables the submit button and sets aria-busy when the isLoading attribute is passed", () => {
    const wrapper = mount(BaseForm, {
      props: {
        isLoading: true,
      },
    });

    // Expect the submit button to be disabled
    expect(wrapper.find("button").attributes("disabled")).toBeDefined();

    // The aria-busy should be true
    expect(wrapper.find("button").attributes("aria-busy")).toBe("true");
  });

  it("is does not disable the submit button by default", () => {
    const wrapper = mount(BaseForm);

    // Expect the submit button to be disabled
    // @todo, according the the HTML spec the attribute shouldnt even exist on the element
    expect(wrapper.find("button").attributes("disabled")).toBeFalsy();
  });

  it("it sets input errors", () => {
    const wrapper = mount(BaseForm, {
      slots: {
        default: `
          <input type="text" name="test" value="test" required />
        `,
      },
    });

    // Call the setInputErrors method on the wrapper
    wrapper.vm.setInputErrors({
      test: ["This is an error"],
    });

    // Expect the input validity to be false
    expect(wrapper.find("input").element.validity.valid).toBe(false);
    expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
  });

  it("sets success on inputs", () => {
    const wrapper = mount(BaseForm, {
      slots: {
        default: `
          <input type="text" name="test" value="test" required />
        `,
      },
    });

    // Call the setInputSuccess method on the wrapper
    wrapper.vm.setSuccessOnInputs();

    // Expect the input validity to be false
    expect(wrapper.find("input").element.validity.valid).toBe(true);

    // The aria-invalid should be false
    expect(wrapper.find("input").attributes("aria-invalid")).toBe("false");
  });

  it("can focus on first input", () => {
    const wrapper = mount(BaseForm, {
      attachTo: document.body,
      slots: {
        default: `
          <input type="text" name="test" value="test" required />
          <input type="text" name="test2" value="test" required />
          `,
      },
    });

    // Call the focusFirstInput method on the wrapper
    wrapper.vm.focusOnFirstInput();

    // Expect the input to be focused on the first input with the name test
    expect(document.activeElement).toBe(
      wrapper.find("input[name='test']").element
    );
  });

  it("does not show the submit button if the showSubmitButton prop is false", () => {
    const wrapper = mount(BaseForm, {
      props: {
        showSubmitButton: false,
      },
    });

    // Expect the submit button to be disabled
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("shows a custom button is passed in the submit slot", () => {
    const wrapper = mount(BaseForm, {
      slots: {
        submit: `
          <button type="submit" id="customSubmit">Submit</button>
        `,
      },
    });

    // Expect a customSubmit button to exist
    expect(wrapper.find("#customSubmit").exists()).toBe(true);
  });

  it("shows submitText in the submit slot if no custom button is passed", () => {
    const wrapper = mount(BaseForm, {
      props: {
        submitText: "Test Submit",
      },
      slots: {
        submit: `
          <button type="submit" id="customSubmit">{{submitText}}</button>
        `,
      },
    });

    // Expect the submit button to be disabled
    expect(wrapper.find("button").text()).toBe("Test Submit");
  });

  it("can be submitted with a custom event in the submit slot", async () => {
    const wrapper = mount(BaseForm, {
      slots: {
        submit: `
          <input type="checkbox" id="customSubmit" @change="submit" />
        `,
      },
    });

    // Submit the form by checking the checkbox
    wrapper.find("#customSubmit").trigger("change");

    // Expect the form to have emitted a submit event
    expect(wrapper.emitted("submit")).toBeTruthy();
  });

  // See issue and SO link above for submit with click
  it.skip("submits form if a custom button is passed in the submit slot", () => {
    const wrapper = mount(BaseForm, {
      slots: {
        submit: `
          <button type="submit" id="customSubmit">Submit</button>
        `,
      },
    });

    // Submit the form
    wrapper.find("#customSubmit").trigger("click");

    // Expect the form to have emitted a submit event
    expect(wrapper.emitted("submit")).toBeTruthy();
  });
});
