import type { Meta, StoryObj } from "@storybook/vue3";
import LoginOrRegisterView from "@/views/Auth/LoginOrRegisterView.vue";
import { useUserStore } from "@/stores/user";
// Import the user fixture json data
import userFixture from "../../cypress/fixtures/user.json";
import { userEvent, within } from "@storybook/test";

const meta: Meta<typeof LoginOrRegisterView> = {
  title: "Page/LoginOrRegister",
  component: LoginOrRegisterView,
  render: () => ({
    components: { LoginOrRegisterView },
    template: "<loginOrRegisterView />",
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoginOrRegisterView>;

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const NoUserData: Story = {};

export const WithUserAlreadyAuthenticated: Story = {
  /** @todo implement */
  render: () => ({
    components: { LoginOrRegisterView },
    setup() {
      const user = useUserStore();
      user.isAuthenticated = true;
      user.userEmail = userFixture.email;

      user.user = {
        ...userFixture,
        seen_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };
    },
    template: "<loginOrRegisterView />",
  }),
};

export const OnRegisterScreem: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // First we fill the field with the user email
    const emailField = canvas.getByPlaceholderText("Email");
    await userEvent.type(emailField, userFixture.email);
    // Then we click the Submit button
    const submitButton = canvas.getByText("Submit");
    await userEvent.click(submitButton);
  },
};
