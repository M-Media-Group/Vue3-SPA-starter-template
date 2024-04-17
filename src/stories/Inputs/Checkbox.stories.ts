import type { Meta, StoryObj } from "@storybook/vue3";
import {
  sharedDecorators,
  sharedInputArgTypes,
  sharedInputArgs,
  sharedTests,
} from "./SharedInputArgs";

type HTMLInputElementCustom = Omit<HTMLInputElement, "type"> & {
  role?: "switch";
} & typeof sharedInputArgs;

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
        <input id='checkbox' type='checkbox' v-bind='args' data-testid="input"></input>
        {{args.value}}
      </label>
      `,
  }),

  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    ...sharedInputArgTypes,
    role: {
      options: [undefined, "switch"],
      control: { type: "select" },
      description: "The role of the input",
      table: { category: "Props" },
    },
  },
  args: {
    ...sharedInputArgs,
    role: undefined,
    checked: true,
  }, // default value
  // Make sure the input is visible in the canvas
  play: async ({ canvasElement, args }) => {
    sharedTests(canvasElement, args);
  },
  decorators: [sharedDecorators],
};

export default meta;
type Story = StoryObj<HTMLInputElementCustom>;

export const Default: Story = {};

export const Switch: Story = {
  args: {
    value: "Checkbox as switch",
    role: "switch",
  },
};

export const Containered: Story = {
  args: {
    name: "tshirt-size",
    value: "Small",
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    // We need to render the radio with options from args - here we show 2 radios
    template: `
      <label class="radio-checkbox-container">
        <input type='checkbox' data-testid="input" v-bind='args' name='{{args.name}}'></input>
        {{args.value}}
      </label>
      <label class="radio-checkbox-container">
        <input type='checkbox' data-testid="input" v-bind='args' name='{{args.name}}' disabled></input>
        {{args.value}}
      </label>
      <label class="radio-checkbox-container">
        <input type='checkbox' data-testid="input" v-bind='args' name='{{args.name}}' disabled></input>
        {{args.value}}
        <small>(Out of stock)</small>
      </label>
      <label class="radio-checkbox-container">
        {{args.value}}
        <small>(Great text here)</small>
        <input type='checkbox' data-testid="input" v-bind='args' name='{{args.name}}'></input>
      </label>
      `,
  }),
};
