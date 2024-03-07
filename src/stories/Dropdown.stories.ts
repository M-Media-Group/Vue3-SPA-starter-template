import type { Meta, StoryObj } from "@storybook/vue3";
import overflowFixture from "../../cypress/fixtures/overflowingData.json";
import { expect, within } from "@storybook/test";
import { checkElementForTextOverflow } from "./utils";
import type { HTMLDetailsElementCustom } from "./Accordion.stories";

const meta: Meta<HTMLDetailsElementCustom> = {
  title: "Components/Dropdown",

  tags: ["autodocs"],

  render: (args) => ({
    template: `<summary
    ${args.role ? `role="${args.role}"` : ""} ${
      args.ariaInvalid ? `aria-invalid="${args.ariaInvalid}"` : ""
    }>${args.title}</summary><ul><li><a href="#">${
      args.optionText
    }</a></li><li><a href="#">${args.optionText}</a></li><li><a href="#">${
      args.optionText
    }</a></li></ul>`,
  }),

  decorators: [
    (story, { args }) => ({
      template: `<details ${
        args.open ? "open" : ""
      } class="dropdown"><story /></details>
      `,
    }),
  ],

  argTypes: {
    role: {
      options: [undefined, "button"],
    },
    ariaInvalid: {
      options: [undefined, "true", "false"],
    },
  },

  args: {
    title: "Hello World",
    open: false,
    role: undefined,
    ariaInvalid: undefined,
    optionText: "This is a dropdown option",
  },
};

export default meta;
type Story = StoryObj<HTMLDetailsElementCustom>;

export const Default: Story = {};

export const Open: Story = {
  args: {
    open: true,
  },
};

export const ButtonRole: Story = {
  args: {
    role: "button",
  },
};

export const OpenWithOverflow: Story = {
  args: {
    ...Open.args,
    title: overflowFixture.text_without_spaces,
    optionText: overflowFixture.text_without_spaces,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByText(overflowFixture.text_without_spaces);

    expect(summary).toBeVisible();

    checkElementForTextOverflow(summary);
  },
};

export const WithRadioButtons: Story = {
  render: ({ optionText }) => ({
    template: `
  <summary>
    Select a phase of matter...
  </summary>
  <ul>
    <li>
      <label>
        <input type="radio" name="phase" value="solid" />
        Solid
      </label>
    </li>
    <li>
      <label>
        <input type="radio" name="phase" value="liquid" />
        Liquid
      </label>
    </li>
    <li>
      <label>
        <input type="radio" name="phase" value="gas" />
        ${optionText}
      </label>
    </li>
    <li>
      <label>
        <input type="radio" name="phase" value="plasma" />
        Plasma
      </label>
    </li>
  </ul>`,
  }),
};

export const WithCheckboxes: Story = {
  render: ({ optionText }) => ({
    template: `
  <summary>
    Select phases of matter...
  </summary>
  <ul>
    <li>
      <label>
        <input type="checkbox" name="solid" />
        Solid
      </label>
    </li>
    <li>
      <label>
        <input type="checkbox" name="liquid" />
        Liquid
      </label>
    </li>
    <li>
      <label>
        <input type="checkbox" name="gas" />
        ${optionText}
      </label>
    </li>
    <li>
      <label>
        <input type="checkbox" name="plasma" />
        Plasma
      </label>
    </li>
  </ul>`,
  }),
};
