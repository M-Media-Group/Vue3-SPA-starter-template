import { describe, expect, it } from "vitest";

import { DOMWrapper, mount } from "@vue/test-utils";
import DropdownSelect from "../DropdownSelect.vue";
import "html-validate/vitest";

describe("Dropdown Select", () => {
  // We need a retry here because the performance.now can be flakey
  it("renders correctly", { retry: 3 }, async () => {
    const start = performance.now();

    const wrapper = mount(DropdownSelect, {
      props: {
        options: ["One", "Two", "Three"],
        "onUpdate:modelValue": (value) => {
          wrapper.setProps({ modelValue: value });
        },
        isOpen: false,
      },
    });

    const end = performance.now();

    expect(end - start).toBeLessThan(25);

    // There should be a select element
    const select = wrapper.find("summary");
    expect(select.exists()).toBe(true);

    // There should be 3 options
    const options = wrapper.findAll("li");
    expect(options.length).toBe(3);
    // The should all not be visible
    expect(options[0].isVisible()).toBe(false);
    expect(options[1].isVisible()).toBe(false);
    expect(options[2].isVisible()).toBe(false);

    // The options should have the correct text
    expect(options[0].text()).toBe("One");
    expect(options[1].text()).toBe("Two");
    expect(options[2].text()).toBe("Three");

    // Expect the snapshot to match
    expect(wrapper.html()).toMatchSnapshot();
    // @ts-ignore an ambient declaration file doesnt seem to work to add toHTMLValidate @todo and check
    expect(wrapper.html()).toHTMLValidate();

    // There should not be a search input
    const input = wrapper.find("input[type='search']");
    expect(input.exists()).toBe(false);
    expect(wrapper.emitted("update:search")).toBeFalsy();

    // There should not be a select all checkbox
    const selectAll = wrapper.find("input[type='checkbox'][value='all']");
    expect(selectAll.exists()).toBe(false);

    // By default the results should not be open
    const details = wrapper.find("details");
    expect(details.attributes("open")).toBe(undefined);
    expect(wrapper.emitted("update:isOpen")).toBeFalsy();

    // Clicking on the summary should open the dropdown
    await select.trigger("click");
    expect(details.attributes("open")).toBe("");

    // Ensure the prop value is updated
    // expect(wrapper.emitted("update:isOpen")).toBeTruthy();
    // expect(wrapper.props("isOpen")).toBe(true);

    // The default placeholder should be "Select an option"
    expect(select.text()).toBe("Select an option");

    // There should be 3 labels
    const labels = wrapper.findAll("label");
    expect(labels.length).toBe(3);

    // Click on the second option
    await labels[1].trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["Two"]]);

    // There should be no placeholder
    expect(select.text()).toBe("Two");

    // Clicking the same option again should do nothing since its a radio
    await labels[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([["Two"]]);
    expect(select.text()).toBe("Two");

    // When we add more options, the dropdown should still render
    await wrapper.setProps({ options: ["One", "Two", "Three", "Four"] });

    // There should be 4 options
    const newOptions = wrapper.findAll("li");
    expect(newOptions.length).toBe(4);

    // When the value is set to something that is not in the options, the placeholder should show the value
    await wrapper.setProps({ modelValue: ["Five"] });
    expect(select.text()).toBe("Five");

    // If no options are passed and the value is an empty string, the placeholder should be "Select an option"
    await wrapper.setProps({ options: [], modelValue: [""] });
    expect(select.text()).toBe("Select an option");
  });

  it("emits the correct value when an option is selected", async () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        open: true,
        options: ["One", "Two", "Three"],
        modelValue: ["One"],
      },
    });

    // Click on the summary to open the dropdown
    await wrapper.find("details").trigger("click");

    const details = wrapper.find("details");

    // Assert there is the open attribute
    expect(details.attributes("open")).toBe("");

    // Assure 3 options are visible
    const options = wrapper.findAll("input");
    expect(options.length).toBe(3);

    // There should be 3 labels
    const labels = wrapper.findAll("label");
    expect(labels.length).toBe(3);

    // Click on the second option
    await labels[1].trigger("click");

    // Expect the correct value to be emitted
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });

  it("shows the search input when the searchable prop is true", async () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        searchable: true,
        searchPlaceholder: "Search for something",
      },
    });

    // There should be a search input
    const input = wrapper.find("input[type='search']");

    // It should be not visible at first
    expect(input.isVisible()).toBe(false);

    // By default the input should not have any focus
    expect(input.element).not.toBe(document.activeElement);

    // Opening the dropdown should focus the input
    await wrapper.find("summary").trigger("click");
    expect(input.isVisible()).toBe(true);

    // Typing in the seach should emit the search event
    input.setValue("Some value");
    expect(wrapper.emitted("update:search")).toBeTruthy();

    // The search should have a placeholder of "Search for something"
    expect(input.attributes("placeholder")).toBe("Search for something");
  });

  it("correctly filters results when the search prop is used", () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        searchable: true,
        options: ["One", "Two", "Three"],
        search: "One",
      },
    });
    // There should be 1 option visible
    const options = wrapper.findAll("label");
    expect(options[0].text()).toBe("One");
    expect(options.length).toBe(1);
  });

  it("does not filter the results when searchLocally is false", () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        searchable: true,
        searchLocally: false,
        options: ["One", "Two", "Three"],
        search: "One",
      },
    });
    // There should be 3 options visible
    const options = wrapper.findAll("label");
    expect(options.length).toBe(3);
  });

  it("correctly filters results when the search prop is used by typing", async () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        searchable: true,
        options: ["One", "Two", "Three"],
        search: "",
        "onUpdate:search": (value) => {
          wrapper.setProps({ search: value });
        },
      },
    });

    const input = wrapper.find("input[type='search']");
    await input.setValue("Two");

    expect(wrapper.emitted("update:search")?.[0]).toEqual(["Two"]);
    expect(wrapper.props("search")).toBe("Two");

    // There should be 1 option visible
    const options = wrapper.findAll("label");
    // There should only be one option visible
    expect(options.length).toBe(1);

    expect(options[0].text()).toBe("Two");
  });

  it("correctly displays options when they are passed as objects", async () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        open: true,
        multiple: true,
        options: [
          {
            id: 1,
            render: "Hello world",
          },
          {
            id: "2",
            render: "This computed callback",
          },
          {
            id: 3,
            render: "Something else",
          },
        ],
        modelValue: [],
        "onUpdate:modelValue": (value) => {
          wrapper.setProps({ modelValue: value });
        },
      },
    });

    // Click on the summary to open the dropdown
    await wrapper.find("details").trigger("click");

    const details = wrapper.find("details");

    // Assert there is the open attribute
    expect(details.attributes("open")).toBe("");

    // Assure 3 options are visible
    const options = wrapper.findAll("input");
    expect(options.length).toBe(3);

    // There should be 3 labels
    const labels = wrapper.findAll("label");
    expect(labels.length).toBe(3);

    // Click on the second option
    await labels[1].trigger("click");

    // Expect the correct value to be emitted
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["2"]]);

    // The summary label should be the first option (its render property)
    expect(wrapper.find("summary").text()).toBe("This computed callback");

    // Selecting another option should add it to the modelValue
    await labels[0].trigger("click");

    // Expect the correct value to be emitted
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([["2", "1"]]);

    // Click summary label should have the correct text
    expect(wrapper.find("summary").text()).toBe(
      "This computed callback, Hello world"
    );

    // Unchecking the second option should remove it from the modelValue
    await labels[1].trigger("click");

    // Expect the correct value to be emitted
    expect(wrapper.emitted("update:modelValue")?.[2]).toEqual([["1"]]);

    // Click summary label should have the correct text
    expect(wrapper.find("summary").text()).toBe("Hello world");

    // Unchecking the first option should remove it from the modelValue
    await labels[0].trigger("click");

    // Expect the correct value to be emitted
    expect(wrapper.emitted("update:modelValue")?.[3]).toEqual([[]]);

    // Click summary label should have the correct text
    expect(wrapper.find("summary").text()).toBe("Select an option");
  });

  it("correctly displays options when they are passed as slots into the `optionSlot` slot", async () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        open: true,
        options: ["One", "Two", "Three"],
        modelValue: ["One"],
      },
      slots: {
        // The slot is called `option` and it receives the option as a prop
        optionSlot: `
          <template #option="{ option, updateModelValue, modelValue }">
            <label>
              <input type="checkbox" :checked="modelValue.includes(option)" @click="updateModelValue" />
              Hello - {{ option.render }}
            </label>
          </template>
        `,
      },
    });

    // Click on the summary to open the dropdown
    await wrapper.find("details").trigger("click");

    const details = wrapper.find("details");

    // Assert there is the open attribute
    expect(details.attributes("open")).toBe("");

    // Assure 3 options are visible
    const options = wrapper.findAll("input");
    expect(options.length).toBe(3);

    // There should be 3 labels
    const labels = wrapper.findAll("label");
    expect(labels.length).toBe(3);

    // Each option should have "Hello - " prepended to it
    expect(labels[0].text()).toBe("Hello - One");

    // Click on the second option
    await labels[0].trigger("click");

    // Expect the correct value to be emitted
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });

  it("emits an event when the user reached the bottom of the dropdown options list", async () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        open: true,
        // Generate 50 options
        options: Array.from({ length: 50 }, (_, i) => `Option ${i}`),
        modelValue: ["One"],
      },
    });

    // Initially, the event should not be emitted
    expect(wrapper.emitted("reachedEndOfList")).toBeFalsy();

    // Click on the summary to open the dropdown
    await wrapper.find("details").trigger("click");

    // Scroll to the bottom of the dropdown
    await wrapper.find("ul").trigger("scroll");

    // Expect the event to be emitted
    expect(wrapper.emitted("reachedEndOfList")?.length).toBe(1);
  });

  it("allows select all and deselect all when the `selectAll` prop is true", async () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        open: false,
        options: ["One", "Two", "Three"],
        selectAll: true,
        multiple: true,
        "onUpdate:modelValue": (value) => {
          wrapper.setProps({ modelValue: value });
        },
      },
    });
    const selectAll = wrapper.find("input[type='checkbox'][value='all']");
    expect(selectAll.exists()).toBe(true);
    expect(selectAll.isVisible()).toBe(false);

    // Click on the summary to open the dropdown
    await wrapper.find("summary").trigger("click");

    // Assert there's a Select all checkbox. It will have a value of all
    expect(selectAll.isVisible()).toBe(true);

    // Click on the select all checkbox which will be the first one in the list
    await selectAll.trigger("click");

    // Expect all options to be selected
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      ["One", "Two", "Three"],
    ]);

    // Click on the select all checkbox again
    await selectAll.trigger("click");

    // Expect all options to be deselected
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([[]]);
  });

  it("allows to toggle select all on and off when one of the options is disabled", async () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        selectAll: true,
        multiple: true,
        "onUpdate:modelValue": (value) => {
          wrapper.setProps({ modelValue: value });
        },
        options: [
          "One",
          "Two",
          "Three",
          { id: "disabledTest", render: "Disabled", disabled: true },
        ],
      },
    });

    // There should be 5 options, the 4 passed and the selectAll
    const options = wrapper.findAll("label");
    expect(options.length).toBe(5);

    // Clicking selectAll should check all options except the disabled one
    const selectAll = wrapper.find(
      "input[type='checkbox'][value='all']"
    ) as DOMWrapper<HTMLInputElement>;
    await selectAll.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      ["One", "Two", "Three"],
    ]);

    // Clicking selectAll again should uncheck all options
    await selectAll.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([[]]);

    // Clicking on the first option should check it, but keep the selectAll unchecked
    await options[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[2]).toEqual([["One"]]);
    expect(selectAll.element.checked).toBeFalsy();

    // Checking the rest of the options should make the selectAll checked
    await options[2].trigger("click");
    await options[3].trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[4]).toEqual([
      ["One", "Two", "Three"],
    ]);

    expect(selectAll.element.checked).toBe(true);
  });

  // We need a retry here because the performance.now can be flakey
  it(
    "should render a large number of options, 1000000, in less than 200ms",
    { retry: 3 },
    () => {
      const options = Array.from({ length: 1000000 }, (_, i) => `Option ${i}`);
      const start = performance.now();
      const wrapper = mount(DropdownSelect, {
        props: {
          options,
          visibleLimit: 25,
        },
      });
      const end = performance.now();
      expect(end - start).toBeLessThan(200);

      // There should be the limited number of options visible (25)
      const visibleOptions = wrapper.findAll("label");
      expect(visibleOptions.length).toBe(25);
    }
  );

  it("should render a disabled option if one is passed", () => {
    const wrapper = mount(DropdownSelect, {
      props: {
        selectAll: true,
        multiple: true,
        "onUpdate:modelValue": (value) => {
          wrapper.setProps({ modelValue: value });
        },
        options: [
          "One",
          "Two",
          "Three",
          { id: "disabledTest", render: "Disabled", disabled: true },
        ],
      },
    });

    const options = wrapper.findAll("label");
    expect(options.length).toBe(5);
    expect(options[4].find("input").attributes("disabled")).toBe("");
    // It should not be checked
    expect(options[4].find("input").attributes("checked")).toBeFalsy();
    // Expect the others to not be disabled
    for (let i = 0; i < 4; i++) {
      expect(options[i].find("input").attributes("disabled")).toBeFalsy();
    }

    // Checking selectAll should not check the disabled option
    const selectAll = wrapper.find("input[type='checkbox'][value='all']");
    selectAll.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      ["One", "Two", "Three"],
    ]);
  });

  it("correctly updates a value in place when setModelValue is passed with an index in the second", async () => {
    //  We need to use the slots to test this
    const wrapper = mount(DropdownSelect, {
      props: {
        open: true,
        options: ["One", "Two", "Three"],
        modelValue: ["One", "Two", "Three"],
        multiple: true,
        "onUpdate:modelValue": (value) => {
          wrapper.setProps({ modelValue: value });
        },
      },
      slots: {
        optionSlot: `
        <template
            #optionSlot="{ option, updateModelValue, modelValue, index }"
          >
          <label>
            <input type="text"
              :value="option.id"
              @input="updateModelValue($event, index)"
            />
            {{ option }}
          </label>
        </template>
      `,
      },
    });

    // Click on the summary to open the dropdown
    await wrapper.find("details").trigger("click");

    // Find the input for the second option - it will have the value of Two
    const input = wrapper.findAll("input").at(1);

    expect(input?.element.value).toBe("Two");

    // Change the value of the input
    await input?.setValue("New Value");

    // Confirm the value has been updated by checking that the second option is now "New Value"
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      ["One", "New Value", "Three"],
    ]);
  });
});
