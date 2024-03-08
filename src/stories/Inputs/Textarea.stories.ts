import type { Meta, StoryObj } from "@storybook/vue3";
import {
  sharedDecorators,
  sharedInputArgTypes,
  sharedInputArgs,
} from "./SharedInputArgs";

// Custom HTMLSelectElement type to add options
type HTMLTextAreaElementCustom = Omit<HTMLTextAreaElement, "options"> &
  typeof sharedInputArgs;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HTMLTextAreaElementCustom> = {
  title: "Components/Inputs/Textarea",
  // We will just show a simple input
  render: (args) => ({
    setup() {
      return { args };
    },
    // We need to render the textarea with options from args
    template: `<textarea id="input" v-bind="args"></textarea>`,
  }),

  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    ...sharedInputArgTypes,
    placeholder: {
      control: "text",
      description: "The placeholder of the input",
    },
  },
  args: {
    ...sharedInputArgs,
    placeholder: "Hello World",
  }, // default value
  decorators: [sharedDecorators],
};

export default meta;
type Story = StoryObj<HTMLTextAreaElementCustom>;

export const Default: Story = {};
