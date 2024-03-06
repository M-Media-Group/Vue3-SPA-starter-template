import type { Meta, StoryObj } from "@storybook/vue3";

// Custom HTMLSelectElement type to add options
type HTMLInputElementCustom = HTMLInputElement & {
  ariaInvalid: boolean | undefined;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HTMLInputElementCustom> = {
  title: "Components/Inputs/Input",
  // We will just show a simple input
  render: (args) => ({
    setup() {
      return { args };
    },
    // We need to render the textarea with options from args
    template:
      "<label for='input'>{{args.name}}</label><input id='input' v-bind='args'></input>",
  }),

  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    // @ts-ignore
    value: {
      control: "text",
      description: "The value of the input",
    },
    placeholder: {
      control: "text",
      description: "The placeholder of the input",
    },
    // Type is an enum
    type: {
      options: [
        "text",
        "password",
        "email",
        "number",
        "tel",
        "url",
        "search",
        "date",
        "time",
        "color",
        "file",
        "range",
      ],
      control: { type: "select" },
      description: "The type of the input",
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
  },
  args: {
    name: "Input",
    value: "Hello World",
    placeholder: "Hello World",
    type: "text",
    required: true,
    disabled: false,
    readOnly: false,
  }, // default value
};

export default meta;
type Story = StoryObj<HTMLInputElementCustom>;

export const Default: Story = {};

export const Password: Story = {
  args: {
    value: "Hello World",
    type: "password",
  },
};

export const Email: Story = {
  args: {
    value: "Hello@World.com",
    type: "email",
  },
};

export const Number: Story = {
  args: {
    value: "131",
    type: "number",
  },
};

export const Tel: Story = {
  args: {
    value: "+0123456789",
    type: "tel",
  },
};

export const Url: Story = {
  args: {
    value: "https://example.com",
    type: "url",
  },
};

export const Search: Story = {
  args: {
    value: "Hello World",
    type: "search",
  },
};

export const Date: Story = {
  args: {
    value: "2021-01-01",
    type: "date",
  },
};

export const Time: Story = {
  args: {
    value: "12:00",
    type: "time",
  },
};

export const Color: Story = {
  args: {
    value: "#000000",
    type: "color",
  },
};

export const File: Story = {
  args: {
    value: "",
    type: "file",
  },
};

export const Range: Story = {
  args: {
    value: "50",
    type: "range",
  },
};
