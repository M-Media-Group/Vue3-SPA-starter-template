// This story tests the body, h1-h6
// We will use just the native h1-h6 tags for this story
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<HTMLElement> = {
  title: "Typography/InlineText",

  tags: ["autodocs"],

  args: {
    title: "Hello World",
  },
};

export default meta;
type Story = StoryObj<HTMLElement>;

export const Abbr: Story = {
  render: ({ title }) => ({
    template: `<abbr title="Hello World">${title}</abbr>`,
  }),
};

export const Mark: Story = {
  render: ({ title }) => ({
    template: `<mark>${title}</mark>`,
  }),
};

export const B: Story = {
  render: ({ title }) => ({
    template: `<b>${title}</b>`,
  }),
};

export const Strong: Story = {
  render: ({ title }) => ({
    template: `<strong>${title}</strong>`,
  }),
};

export const I: Story = {
  render: ({ title }) => ({
    template: `<i>${title}</i>`,
  }),
};

export const Em: Story = {
  render: ({ title }) => ({
    template: `<em>${title}</em>`,
  }),
};

export const Small: Story = {
  render: ({ title }) => ({
    template: `<small>${title}</small>`,
  }),
};

export const Del: Story = {
  render: ({ title }) => ({
    template: `<del>${title}</del>`,
  }),
};

export const Ins: Story = {
  render: ({ title }) => ({
    template: `<ins>${title}</ins>`,
  }),
};

export const Sub: Story = {
  render: ({ title }) => ({
    template: `<sub>${title}</sub>`,
  }),
};

export const Sup: Story = {
  render: ({ title }) => ({
    template: `<sup>${title}</sup>`,
  }),
};

export const U: Story = {
  render: ({ title }) => ({
    template: `<u>${title}</u>`,
  }),
};

export const Code: Story = {
  render: ({ title }) => ({
    template: `<code>${title}</code>`,
  }),
};

export const Kbd: Story = {
  render: ({ title }) => ({
    template: `<kbd>${title}</kbd>`,
  }),
};

export const Samp: Story = {
  render: ({ title }) => ({
    template: `<samp>${title}</samp>`,
  }),
};

export const Var: Story = {
  render: ({ title }) => ({
    template: `<var>${title}</var>`,
  }),
};

export const Cite: Story = {
  render: ({ title }) => ({
    template: `<cite>${title}</cite>`,
  }),
};

export const Q: Story = {
  render: ({ title }) => ({
    template: `<q>${title}</q>`,
  }),
};

export const Dfn: Story = {
  render: ({ title }) => ({
    template: `<dfn>${title}</dfn>`,
  }),
};

export const S: Story = {
  render: ({ title }) => ({
    template: `<s>${title}</s>`,
  }),
};
