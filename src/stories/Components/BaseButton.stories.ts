import type { Meta, StoryObj } from "@storybook/vue3";

import BaseButton from "@/components/BaseButton.vue";

import overflowFixture from "../../../cypress/fixtures/overflowingData.json";
import { expect, within } from "@storybook/test";
import {
  expectChildrenNotOverflowing,
  expectElementToBeCentered,
  expectTextNotOverflowing,
} from "../utils";
import { h } from "vue";

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
      table: { category: "Props" },
      description:
        "The URL to link to. Use this if you are linking to external sites. Otherwise, you should use the `to` prop instead.",
    },
    to: {
      control: "text",
      table: { category: "Props" },
      description:
        "The path to link to. Use this if you are linking to internal sites. Otherwise, you should use the `href` prop instead.",
    },
    ariaBusy: {
      control: "boolean",
      table: { category: "Props" },
      description: "If the button is busy",
      type: { required: false },
    },
    disabled: {
      control: "boolean",
      table: { category: "Props" },
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
      table: { category: "Props" },
      description: "The class(es) of the button to apply",
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

    expectTextNotOverflowing(button);
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

    expectTextNotOverflowing(button);
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

    expectTextNotOverflowing(button);
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

    expectChildrenNotOverflowing(buttonGroup.children, buttonGroup);
    expectTextNotOverflowing(buttonGroup);
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

export const ButtonWithSVG: Story = {
  args: {
    // @ts-ignore
    ariaLabel: "Heart",
    default: () => [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        h("path", {
          d: "M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z",
        })
      ),
    ],
  },

  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Get the SVG in the button
    const svg = button.querySelector("svg");
    expect(svg).toBeVisible();

    if (!svg) {
      return;
    }

    expectElementToBeCentered(svg, button);
  },
};

export const ButtonWithSVGLoading: Story = {
  args: {
    // @ts-ignore
    ariaLabel: "Heart",
    ariaBusy: true,
    default: () => [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        h("path", {
          d: "M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z",
        })
      ),
    ],
  },
};

export const ButtonWithSVGAndText: Story = {
  args: {
    // @ts-ignore
    ariaLabel: "Heart",
    default: () => [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        h("path", {
          d: "M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z",
        })
      ),
      "Like",
    ],
  },
};
