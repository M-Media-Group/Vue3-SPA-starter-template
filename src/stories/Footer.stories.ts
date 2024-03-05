import PageFooter from "@/components/PageFooter.vue";
import { userEvent, within } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof PageFooter> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/Footer",
  component: PageFooter,
  render: (args: any) => ({
    components: { PageFooter },
    setup() {
      return { args };
    },
    template: "<main></main><PageFooter />",
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageFooter>;

export const Default: Story = {};

export const OpenSelect: Story = {
  // We will play a click on the first dropdown, and select the second item
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Get the dropdown by name dark-mode
    const dropdown = canvas.getByDisplayValue("Auto");
    await userEvent.click(dropdown);
  },
};
