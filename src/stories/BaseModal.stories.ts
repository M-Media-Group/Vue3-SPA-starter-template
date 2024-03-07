import type { Meta, StoryObj } from "@storybook/vue3";

import BaseModal from "@/components/modals/BaseModal.vue";
import { expect, within } from "@storybook/test";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof BaseModal> = {
  title: "Components/BaseModal",
  component: BaseModal,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {
    title: "Hello World",
    triggerText: "Hello World",
    default: "Hello World",
  }, // default value
};

export default meta;
type Story = StoryObj<typeof BaseModal>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {};

export const DefaultOpened: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Cancel")).not.toBeVisible();

    // Click the button
    const button = canvas.getByText("Hello World", { selector: "button" });
    await button.click();
    expect(canvas.queryByText("Cancel")).toBeVisible();

    // The modal, which is in `article` tag, should be in the middle of the screen
    const modal = canvas.getByRole("article");
    const modalRect = modal.getBoundingClientRect();
    const canvasRect = canvasElement.getBoundingClientRect();

    // The modals left edge to the left side of the screen should be the same as the right edge of the canvas
    const leftModalDistance = modalRect.left - canvasRect.left;
    const rightCanvasDistance = canvasRect.right - modalRect.right;
    expect(leftModalDistance).toBe(rightCanvasDistance);
  },
};

export const OverflowingContent: Story = {
  args: {
    title: "Overflowing Content",
    default: `**Welcome to Our Application**Welcome to our application. We are dedicated to providing you with the best experience possible. Our team has worked hard to ensure that our application is user-friendly and packed with features that will meet your needs.**Features and Benefits**Our application offers a wide range of features designed to help you manage your tasks efficiently. You can schedule tasks, set reminders, and even share tasks with others. Plus, our application is accessible from any device, so you can stay organized no matter where you are.**Privacy and Security**Your privacy and security are our top priorities. We use state-of-the-art encryption to protect your data and ensure that your information is safe. We also respect your privacy and will never sell or share your information with third parties.**Getting Started**Getting started with our application is easy. Simply create an account, verify your email, and you're ready to go. If you need help along the way, our support team is available 24/7 to assist you.**Feedback and Support**We value your feedback and are always looking to improve. If you have any suggestions or run into any issues, please don't hesitate to contact our support team. We're here to help and want to make sure you have the best experience possible.**Welcome to Our Application**Welcome to our application. We are dedicated to providing you with the best experience possible. Our team has worked hard to ensure that our application is user-friendly and packed with features that will meet your needs.**Features and Benefits**Our application offers a wide range of features designed to help you manage your tasks efficiently. You can schedule tasks, set reminders, and even share tasks with others. Plus, our application is accessible from any device, so you can stay organized no matter where you are.**Privacy and Security**Your privacy and security are our top priorities. We use state-of-the-art encryption to protect your data and ensure that your information is safe. We also respect your privacy and will never sell or share your information with third parties.**Getting Started**Getting started with our application is easy. Simply create an account, verify your email, and you're ready to go. If you need help along the way, our support team is available 24/7 to assist you.**Feedback and Support**We value your feedback and are always looking to improve. If you have any suggestions or run into any issues, please don't hesitate to contact our support team. We're here to help and want to make sure you have the best experience possible.**Welcome to Our Application**Welcome to our application. We are dedicated to providing you with the best experience possible. Our team has worked hard to ensure that our application is user-friendly and packed with features that will meet your needs.**Features and Benefits**Our application offers a wide range of features designed to help you manage your tasks efficiently. You can schedule tasks, set reminders, and even share tasks with others. Plus, our application is accessible from any device, so you can stay organized no matter where you are.**Privacy and Security**Your privacy and security are our top priorities. We use state-of-the-art encryption to protect your data and ensure that your information is safe. We also respect your privacy and will never sell or share your information with third parties.**Getting Started**Getting started with our application is easy. Simply create an account, verify your email, and you're ready to go. If you need help along the way, our support team is available 24/7 to assist you.**Feedback and Support**We value your feedback and are always looking to improve. If you have any suggestions or run into any issues, please don't hesitate to contact our support team. We're here to help and want to make sure you have the best experience possible.`,
  },
};

export const MinimumExample: Story = {
  args: {
    triggerText: undefined,
    default: null,
  },
};

/**
 * This story will show the modal with the background click to close feature disabled, and no clickable close options. You could still escape using the "escape" key
 */
export const LockedIn: Story = {
  args: {
    allowBackgroundClickToClose: false,
    showFooter: false,
    showCloseInHeader: false,
  },
};

export const WithoutFooter: Story = {
  args: {
    showFooter: false,
  },
};
