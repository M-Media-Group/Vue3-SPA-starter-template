import type { Meta, StoryObj } from "@storybook/vue3";

// Custom HTMLSelectElement type to add options
type HTMLTextAreaElementCustom = Omit<HTMLTextAreaElement, "options"> & {
  options: string[];
  ariaInvalid: boolean | undefined;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HTMLTextAreaElementCustom> = {
  title: "Components/Inputs/Textarea",
  // We will just show a simple input
  render: (args) => ({
    setup() {
      return { args };
    },
    // We need to render the textarea with options from args
    template:
      "<label for='textarea'>{{args.name}}</label><textarea id='textarea' v-bind='args'></textarea>",
  }),

  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "The value of the input",
    },
    placeholder: {
      control: "text",
      description: "The placeholder of the input",
    },
    disabled: {
      control: "boolean",
      description: "If the input is disabled",
    },
    // aria-invalid can be true, false, or undefined
    ariaInvalid: {
      // We need 3 options, true, false, and undefined
      options: ["true", "false", undefined],
      control: { type: "select" },
      description:
        "If the input is invalid. If false, the input is valid. If undefined, the input is neither valid nor invalid",
    },
  },
  args: {
    name: "Textarea",
    value: "Hello World",
    placeholder: "Hello World",
    required: true,
    disabled: false,
    readOnly: false,
    ariaInvalid: undefined,
  }, // default value
};

export default meta;
type Story = StoryObj<HTMLTextAreaElementCustom>;

export const Default: Story = {};
