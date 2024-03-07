// This story tests the body, h1-h6
// We will use just the native h1-h6 tags for this story
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<HTMLElement> = {
  title: "Typography/Links",

  tags: ["autodocs"],

  args: {
    title: "Hello World",
  },
};

export default meta;
type Story = StoryObj<HTMLElement>;

export const LinkPrimary: Story = {
  render: ({ title }) => ({
    template: `<a href="https://example.com">${title}</a>`,
  }),
};

export const LinkSecondary: Story = {
  render: ({ title }) => ({
    template: `<a href="https://example.com" class="secondary">${title}</a>`,
  }),
};

export const LinkContrast: Story = {
  render: ({ title }) => ({
    template: `<a href="https://example.com" class="contrast">${title}</a>`,
  }),
};

export const LinkActive: Story = {
  render: ({ title }) => ({
    template: `<a href="https://example.com" aria-current="page">${title}</a>`,
  }),
};
