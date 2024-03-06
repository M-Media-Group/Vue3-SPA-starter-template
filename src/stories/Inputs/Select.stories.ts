import type { Meta, StoryObj } from "@storybook/vue3";

// Custom HTMLSelectElement type to add options
type HTMLSelectElementCustom = Omit<HTMLSelectElement, "options"> & {
  options: string[];
  ariaInvalid: boolean | undefined;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HTMLSelectElementCustom> = {
  title: "Components/Inputs/Select",
  // We will just show a simple input
  render: (args) => ({
    setup() {
      return { args };
    },
    // We need to render the select with options from args
    template:
      "<label for='select'>{{args.name}}</label><select id='select' v-bind='args'><option v-for='option in args.options' :value='option'>{{ option }}</option></select>",
  }),

  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "The value of the input",
    },
    disabled: {
      control: "boolean",
      description: "If the input is disabled",
    },
    // aria-invalid can be true, false, or undefined
    ariaInvalid: {
      // We need 3 options, true, false, and undefined
      options: [true, false, undefined],
      control: { type: "select" },
      description:
        "If the input is invalid. If false, the input is valid. If undefined, the input is neither valid nor invalid",
    },
    size: {
      control: "number",
      description: "The size of the input",
    },
  },
  args: {
    value: "Option 1",
    required: true,
    disabled: false,
    multiple: false,
    name: "Select",
    options: ["Option 1", "Option 2", "Option 3"],
    size: undefined,
  }, // default value
};

export default meta;
type Story = StoryObj<HTMLSelectElementCustom>;

export const Default: Story = {};

export const Multiple: Story = {
  args: {
    multiple: true,
    size: 3,
  },
};
