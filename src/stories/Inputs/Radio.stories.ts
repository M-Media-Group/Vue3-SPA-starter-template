import type { Meta, StoryObj } from "@storybook/vue3";
import {
  sharedInputArgTypes,
  sharedInputArgs,
  sharedTests,
} from "./SharedInputArgs";

type HTMLInputElementCustom = Omit<HTMLInputElement, "type"> &
  typeof sharedInputArgs;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HTMLInputElementCustom> = {
  title: "Components/Inputs/Radio",
  // We will just show a simple input
  render: (args) => ({
    setup() {
      return { args };
    },
    // We need to render the radio with options from args
    template: `
      <label for='radio'>
        <input id='radio' type='radio' v-bind='args' data-testid="input"></input>
        {{args.name}}
      </label>
      `,
  }),

  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    ...sharedInputArgTypes,
  },
  args: {
    ...sharedInputArgs,
    checked: true,
  },
  play: async ({ canvasElement }) => {
    sharedTests(canvasElement);
  },
};

export default meta;
type Story = StoryObj<HTMLInputElementCustom>;

export const Default: Story = {};
