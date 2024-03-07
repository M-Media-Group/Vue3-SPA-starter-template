import type { Meta, StoryObj } from "@storybook/vue3";

import BaseButton from "@/components/BaseButton.vue";

import overflowFixture from "../../../cypress/fixtures/overflowingData.json";
import { expect, within } from "@storybook/test";
import {
  checkChildrenForOverflow,
  checkElementForTextOverflow,
} from "../utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof BaseButton> = {
  title: "Components/BaseButton",
  component: BaseButton,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    // @ts-ignore
    href: {
      control: "text",
      table: { category: "Links" },
      description:
        "The URL to link to. Use this if you are linking to external sites. Otherwise, you should use the `to` prop instead.",
    },
    to: {
      control: "text",
      table: { category: "Links" },
      description:
        "The path to link to. Use this if you are linking to internal sites. Otherwise, you should use the `href` prop instead.",
    },
    ariaBusy: {
      control: "boolean",
      table: { category: "Accessibility" },
      description: "If the button is busy",
      type: { required: false },
    },
    disabled: {
      control: "boolean",
      table: { category: "Accessibility" },
      description: "If the button is disabled",
    },
    class: {
      // Is an enum of undefined, primary, or secondary
      options: [
        undefined,
        "secondary",
        "contrast",
        "outline",
        "outline secondary",
        "outline contrast",
      ],
      control: { type: "select" },
      table: { category: "Styles" },
    },
  },
  args: {
    default: "Button",
  }, // default value

  // Make sure the button is visible in the canvas
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const button = canvas.getAllByRole("button")[0];
    expect(button).toBeVisible();
  },
};

export default meta;
type Story = StoryObj<typeof BaseButton>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const UsingHref: Story = {
  args: {
    // @ts-ignore
    href: "/",
  },
};

export const UsingToProp: Story = {
  args: {
    to: "/",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Busy: Story = {
  args: {
    // @ts-ignore
    ariaBusy: true,
  },
};

export const WithOverflowingText: Story = {
  args: {
    default: overflowFixture.text,
  },
  // The text in the button should not be overflowing the button, and the button should not be overflowing the screen
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    const buttonRect = button.getBoundingClientRect();
    const canvasRect = canvasElement.getBoundingClientRect();

    expect(buttonRect.width).toBeLessThanOrEqual(canvasRect.width);
    expect(buttonRect.height).toBeLessThanOrEqual(canvasRect.height);

    checkElementForTextOverflow(button);
  },
};

export const WithOverflowingNoSpacesText: Story = {
  args: {
    default: overflowFixture.text_without_spaces,
  },
  // The text in the button should not be overflowing the button, and the button should not be overflowing the screen
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    const buttonRect = button.getBoundingClientRect();
    const canvasRect = canvasElement.getBoundingClientRect();

    expect(buttonRect.width).toBeLessThanOrEqual(canvasRect.width);
    expect(buttonRect.height).toBeLessThanOrEqual(canvasRect.height);

    checkElementForTextOverflow(button);
  },
};

export const LoadingWithOverflowingNoSpacesText: Story = {
  args: {
    default: overflowFixture.text_without_spaces,
    // @ts-ignore
    ariaBusy: true,
  },
  // The text in the button should not be overflowing the button, and the button should not be overflowing the screen
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    const buttonRect = button.getBoundingClientRect();
    const canvasRect = canvasElement.getBoundingClientRect();

    expect(buttonRect.width).toBeLessThanOrEqual(canvasRect.width);
    expect(buttonRect.height).toBeLessThanOrEqual(canvasRect.height);

    checkElementForTextOverflow(button);
  },
};

export const Secondary: Story = {
  args: {
    class: "secondary",
  },
};

export const Contrast: Story = {
  args: {
    class: "contrast",
  },
};

export const Outline: Story = {
  args: {
    class: "outline",
  },
};

export const OutlineSecondary: Story = {
  args: {
    class: "outline secondary",
  },
};

export const OutlineContrast: Story = {
  args: {
    class: "outline contrast",
  },
};

// Use a decorator to show a grouped
export const Grouped: Story = {
  decorators: [
    () => ({
      template: `<div role=group><story /><story /><story /></div>`,
    }),
  ],
};

export const GroupedWithOverflowingText: Story = {
  args: {
    default: overflowFixture.text_without_spaces,
  },
  decorators: [
    () => ({
      template: `<div role=group><story /><story /><story /></div>`,
    }),
  ],

  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const buttonGroup = canvas.getByRole("group");
    const buttonGroupRect = buttonGroup.getBoundingClientRect();
    const canvasRect = canvasElement.getBoundingClientRect();

    expect(buttonGroupRect.width).toBeLessThanOrEqual(canvasRect.width);
    expect(buttonGroupRect.height).toBeLessThanOrEqual(canvasRect.height);

    checkChildrenForOverflow(buttonGroup.children, buttonGroup);
    checkElementForTextOverflow(buttonGroup);
  },
};

export const InputAndButton: Story = {
  args: {
    default: "Submit",
  },
  decorators: [
    () => ({
      template: `
      <form>
        <fieldset role="group">
          <input name="email" type="email" placeholder="Email" autocomplete="email" />
          <story />
        </fieldset>
      </form>`,
    }),
  ],
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    // The input and button should be the same height. We cannot guarantee the exact height if the text is long (something has to stretch so we don't overflow), but in this test, we have a very short text
    const input = canvas.getByPlaceholderText("Email");
    const button = canvas.getByRole("button");
    const inputRect = input.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    expect(inputRect.height).toBeCloseTo(buttonRect.height, 0);
  },
};
