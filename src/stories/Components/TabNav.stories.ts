import type { Meta, StoryObj } from "@storybook/vue3";

import TabNav from "@/components/TabNav.vue";

import { useUserStore } from "@/stores/user";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof TabNav> = {
  title: "Components/TabNav",
  component: TabNav,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],

  // pass a options prop to the component
  args: {
    options: [
      { render: "Page 1", id: "1" },
      { render: "Page 2", id: "2" },
      { render: "Page 3", id: "3" },
      { render: "Page 4", id: "4", disabled: true },
      { render: "Page 5", id: "5" },
    ],
    modelValue: [],
  },

  render: (args) => ({
    components: { TabNav },
    setup() {
      const user = useUserStore();
      user.isAuthenticated = true;
      return { args };
    },
    template: "<tab-nav v-bind='args' v-model='args.modelValue' />",
  }),
  //  Set the router "user.isAuthenticated" to true. We will useUserStore to set the user to authenticated
};

export default meta;
type Story = StoryObj<typeof TabNav>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {};

export const WithBadge: Story = {
  args: {
    options: [
      {
        render: "Page 1",
        id: "1",
        badge: "23",
      },
      {
        render: "Page 2",
        id: "2",
      },
      {
        render: "Page 3",
        id: "3",
        badge: true,
      },
      {
        render: "Page 4",
        id: "4",
        disabled: true,
        badge: "Pro feature only",
      },
      {
        render: "Page 5",
        id: "5",
      },
    ],

    modelValue: [],
  },
};
