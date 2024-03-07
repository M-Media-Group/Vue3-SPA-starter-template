import type { Meta, StoryObj } from "@storybook/vue3";

import BaseButton from "@/components/BaseButton.vue";

import overflowFixture from "../../cypress/fixtures/overflowingData.json";

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
    (story: any) => ({
      template: `<div role=group><story /><story /><story /></div>`,
    }),
  ],
};
