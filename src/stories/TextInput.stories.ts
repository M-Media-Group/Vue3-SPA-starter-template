import type { Meta, StoryObj } from "@storybook/web-components";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta = {
  title: "Components/Inputs/Input",
  // We will just show a simple input
  component: "input",

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
      options: ["text", "password", "email", "number", "tel", "url"],
      control: { type: "select" },
      // Default to text
      defaultValue: "text",
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
    value: "Hello World",
    placeholder: "Hello World",
    type: "text",
    required: true,
    disabled: false,
    readonly: false,
  }, // default value
};

export default meta;
type Story = StoryObj<HTMLInputElement>;

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
