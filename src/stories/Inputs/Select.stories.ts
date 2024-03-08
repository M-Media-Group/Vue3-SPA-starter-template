import type { Meta, StoryObj } from "@storybook/vue3";
import {
  sharedDecorators,
  sharedInputArgTypes,
  sharedInputArgs,
  sharedTests,
} from "./SharedInputArgs";

// Custom HTMLSelectElement type to add options
type HTMLSelectElementCustom = Omit<HTMLSelectElement, "options"> & {
  options: string[];
} & typeof sharedInputArgs;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HTMLSelectElementCustom> = {
  title: "Components/Inputs/Select",
  // We will just show a simple input
  render: (args) => ({
    setup() {
      return { args };
    },
    // We need to render the select with options from args
    template: `<select id="input" v-bind="args" data-testid="input"><option v-for='option in args.options' :value='option'>{{ option }}</option></select>`,
  }),

  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    ...sharedInputArgTypes,

    size: {
      control: "number",
      description: "The size of the input",
    },
  },
  args: {
    ...sharedInputArgs,
    value: "Value Hello World",
    multiple: false,
    options: ["Option 1", "Option 2", "Option 3"],
    size: undefined,
  }, // default value
  decorators: [sharedDecorators],
  play: async ({ canvasElement, args }) => {
    sharedTests(canvasElement, args);
  },
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
