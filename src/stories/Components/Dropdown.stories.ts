import type { Meta, StoryObj } from "@storybook/vue3";
import overflowFixture from "../../../cypress/fixtures/overflowingData.json";
import { expect, userEvent, within } from "@storybook/test";
import { expectTextNotOverflowing } from "../utils";
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

export const AriaInvalidTrue: Story = {
  args: {
    ariaInvalid: "true",
  },
};

export const AriaInvalidFalse: Story = {
  args: {
    ariaInvalid: "false",
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
    optionText: overflowFixture.text,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByText(overflowFixture.text_without_spaces);

    expect(summary).toBeVisible();

    expectTextNotOverflowing(summary);
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
  args: {
    open: true,
  },
  render: ({ optionText, title }) => ({
    template: `
  <summary>
    ${title}
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

  play: async ({ canvasElement, args }: any) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(4);

    // Clicking the first checkbox should check it and not hide the dropdown
    await userEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[0]).toBeVisible();

    // Clickling on the summary should hide the dropdown
    const summary = canvas.getByText(args.title);
    await userEvent.click(summary);
    expect(checkboxes[0]).not.toBeVisible();
  },
};
