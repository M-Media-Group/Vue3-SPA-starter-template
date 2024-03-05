import type { Meta, StoryObj } from "@storybook/vue3";

import BaseButton from "@/components/BaseButton.vue";

import { vueRouter } from "storybook-vue3-router";

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
      type: { required: false },
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

/* adding storybook-vue3-router decorator */
UsingToProp.decorators = [
  /* this is the basic setup with no params passed to the decorator */
  vueRouter(),
];
