import type { Meta, StoryObj } from "@storybook/vue3";
import {
  sharedDecorators,
  sharedInputArgTypes,
  sharedInputArgs,
  sharedTests,
} from "./SharedInputArgs";

// Custom HTMLSelectElement type to add options
type HTMLInputElementCustom = HTMLInputElement & {
  role: string;
} & typeof sharedInputArgs;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HTMLInputElementCustom> = {
  title: "Components/Inputs/Input",
  // We will just show a simple input
  render: (args) => ({
    setup() {
      return { args };
    },
    // We need to render the textarea with options from args
    template: `<input id="input" v-bind="args" data-testid="input" />`,
  }),

  decorators: [sharedDecorators],
  // Make sure the input is visible in the canvas
  play: async ({ canvasElement, args }) => {
    sharedTests(canvasElement, args);
  },

  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    ...sharedInputArgTypes,
    placeholder: {
      control: "text",
      description: "The placeholder of the input",
      table: { category: "Props" },
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
        "submit",
      ],
      control: { type: "select" },
      description: "The type of the input",
      table: { category: "Props" },
    },
  },
  args: {
    ...sharedInputArgs,
    value: "Hello World",
    placeholder: "Hello World",
    type: "text",
  },
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
    helpText: undefined,
  },
};

export const Range: Story = {
  args: {
    value: "50",
    type: "range",
  },
};

export const Submit: Story = {
  args: {
    value: "Submit",
    type: "submit",
  },
};
