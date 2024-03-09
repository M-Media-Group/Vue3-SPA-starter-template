import type { Meta, StoryObj } from "@storybook/vue3";

import PaginationNav from "@/components/PaginationNav.vue";

import { useUserStore } from "@/stores/user";
import { within } from "@storybook/test";
import { expectTextNotOverflowing } from "../utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof PaginationNav> = {
  title: "Components/PaginationNav",
  component: PaginationNav,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],

  render: (args) => ({
    components: { PaginationNav },
    setup() {
      const user = useUserStore();
      user.isAuthenticated = true;
      return { args };
    },
    template:
      "<PaginationNav v-bind='args' v-model:currentPage='args.currentPage' />",
  }),
  //  Set the router "user.isAuthenticated" to true. We will useUserStore to set the user to authenticated
};

export default meta;
type Story = StoryObj<typeof PaginationNav>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  args: {
    totalItems: 100,
  },
};

export const Overflow: Story = {
  args: {
    totalItems: 1000000000,
    currentPage: 500000,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    expectTextNotOverflowing(canvasElement);

    for (const button of buttons) {
      await expectTextNotOverflowing(button);
    }
  },
};

export const NegativeTotalItems: Story = {
  args: {
    totalItems: -1,
    currentPage: 1,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    expectTextNotOverflowing(canvasElement);

    for (const button of buttons) {
      await expectTextNotOverflowing(button);
    }
  },
};
