// This story tests the body, h1-h6
// We will use just the native h1-h6 tags for this story
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<HTMLElement> = {
  title: "Typography/Body",

  tags: ["autodocs"],

  args: {
    title: "Hello World",
  },
};

export default meta;
type Story = StoryObj<HTMLElement>;

export const P: Story = {
  render: ({ title }) => ({
    template: `<p>${title}</p>`,
  }),
};

export const Span: Story = {
  render: ({ title }) => ({
    template: `<span>${title}</span>`,
  }),
};

export const Small: Story = {
  render: ({ title }) => ({
    template: `<small>${title}</small>`,
  }),
};
