// This story tests the headings, h1-h6
// We will use just the native h1-h6 tags for this story
import type { Meta, StoryObj } from "@storybook/vue3";

type HTMLHeadingElementCustom = HTMLHeadingElement & {
  level?: number;
};

const meta: Meta<HTMLHeadingElementCustom> = {
  title: "Typography/Headings",

  tags: ["autodocs"],

  args: {
    title: "Hello World",
  },
};

export default meta;
type Story = StoryObj<HTMLHeadingElementCustom>;

export const H1: Story = {
  render: ({ title }) => ({
    // Render the template with the title as the text + the story name
    template: `<h1>${title}</h1>`,
  }),
};
export const H2: Story = {
  render: ({ title }) => ({
    template: `<h2>${title}</h2>`,
  }),
};
export const H3: Story = {
  render: ({ title }) => ({
    template: `<h3>${title}</h3>`,
  }),
};
export const H4: Story = {
  render: ({ title }) => ({
    template: `<h4>${title}</h4>`,
  }),
};
export const H5: Story = {
  render: ({ title }) => ({
    template: `<h5>${title}</h5>`,
  }),
};
export const H6: Story = {
  render: ({ title }) => ({
    template: `<h6>${title}</h6>`,
  }),
};
export const AllHeadings: Story = {
  render: ({ title }) => ({
    template: `
            <h1>${title}</h1>
            <h2>${title}</h2>
            <h3>${title}</h3>
            <h4>${title}</h4>
            <h5>${title}</h5>
            <h6>${title}</h6>
        `,
  }),
};

export const HeadingGroup: Story = {
  args: {
    level: 1,
  },
  render: ({ title, level }) => ({
    template: `
        <hgroup>
        <h${level}>${title}</h${level}>
        <p>Some other text</p>
        </hgroup>
        `,
  }),
};
