import type { Meta, StoryObj } from "@storybook/vue3";

import AddPaymentMethod from "@/forms/AddPaymentMethod.vue";
import { useUserStore } from "@/stores/user";

import userFixture from "../../../cypress/fixtures/user.json";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof AddPaymentMethod> = {
  title: "Forms/AddPaymentMethod",
  component: AddPaymentMethod,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AddPaymentMethod>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  render: (args) => ({
    components: { AddPaymentMethod },
    setup() {
      const user = useUserStore();
      user.isAuthenticated = true;
      user.user = {
        ...userFixture,
        seen_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };
      return { args };
    },
    template:
      "<AddPaymentMethod v-bind='args'><input type='email' name='email' required placeholder='Email' /><input type='password' name='password' required placeholder='Password' /></AddPaymentMethod>",
  }),
};