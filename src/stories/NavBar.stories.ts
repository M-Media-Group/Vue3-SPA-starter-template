import type { Meta, StoryObj } from "@storybook/vue3";

import NavBar from "@/components/NavBar.vue";

import { useUserStore } from "@/stores/user";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof NavBar> = {
  title: "Components/NavBar",
  component: NavBar,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  //  Set the router "user.isAuthenticated" to true. We will useUserStore to set the user to authenticated
};

export default meta;
type Story = StoryObj<typeof NavBar>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const LoggedIn: Story = {
  render: () => ({
    components: { NavBar },
    setup() {
      const user = useUserStore();
      user.isAuthenticated = true;
    },
    template: "<NavBar />",
  }),
};

export const LoggedOut: Story = {
  args: {
    // @ts-ignore
    href: "/",
  },
};
