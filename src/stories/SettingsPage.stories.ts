import type { Meta, StoryObj } from "@storybook/vue3";
import SettingsView from "@/views/Auth/SettingsView.vue";
import { useUserStore } from "@/stores/user";
// Import the user fixture json data
import userFixture from "../../cypress/fixtures/user.json";

const meta: Meta<typeof SettingsView> = {
  title: "Page/UserSettings",
  component: SettingsView,
  render: () => ({
    components: { SettingsView },
    template: "<settingsView />",
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SettingsView>;

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const NoUserData: Story = {};

export const WithUserData: Story = {
  /** @todo implement */
  render: () => ({
    components: { SettingsView },
    setup() {
      const user = useUserStore();
      user.isAuthenticated = true;
      user.user = {
        ...userFixture,
        seen_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };
    },
    template: "<settingsView />",
  }),
};
