import type { Meta, StoryObj } from "@storybook/vue3";

import OpenStreetDropdown from "@/components/examples/OpenStreetDropdown.vue";

import { expect, within } from "@storybook/test";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof OpenStreetDropdown> = {
  title: "Components/Examples/OpenStreetDropdown",
  component: OpenStreetDropdown,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],

  // Make sure the button is visible in the canvas
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const button = canvas.getAllByRole("button")[0];
    expect(button).toBeVisible();
  },
};

export default meta;
type Story = StoryObj<typeof OpenStreetDropdown>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {};
