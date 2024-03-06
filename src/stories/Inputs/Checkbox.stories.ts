import type { Meta, StoryObj } from "@storybook/vue3";

type HTMLInputElementCustom = Omit<HTMLInputElement, "type"> & {
  role?: "switch";
  ariaInvalid: boolean | undefined;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HTMLInputElementCustom> = {
  title: "Components/Inputs/Checkbox",
  // We will just show a simple input
  render: (args) => ({
    setup() {
      return { args };
    },
    // We need to render the checkbox with options from args
    template: `
      <label for='checkbox'>
        <input id='checkbox' type='checkbox' v-bind='args'></input>
        {{args.name}}
      </label>
      `,
  }),

  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
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
    role: {
      options: [undefined, "switch"],
      control: { type: "select" },
      description: "The role of the input",
    },
  },
  args: {
    checked: true,
    name: "Checkbox",
    required: true,
    disabled: false,
    readOnly: false,
    role: undefined,
  }, // default value
};

export default meta;
type Story = StoryObj<HTMLInputElementCustom>;

export const Default: Story = {};

export const Switch: Story = {
  args: {
    name: "Switch",
    role: "switch",
  },
};
