import type { Meta, StoryObj } from "@storybook/vue3";

import BaseBadge from "@/components/BaseBadge.vue";

import overflowFixture from "../../../cypress/fixtures/overflowingData.json";
import { expect, within } from "@storybook/test";
import { expectElementToBeCentered, expectTextNotOverflowing } from "../utils";
import { h } from "vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof BaseBadge> = {
  title: "Components/BaseBadge",
  component: BaseBadge,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    // @ts-ignore
    ariaBusy: {
      control: "boolean",
      table: { category: "Props" },
      description: "If the badge is busy",
      type: { required: false },
    },
    class: {
      // Is an enum of undefined, primary, or secondary
      options: [
        undefined,
        "notification",
        "secondary",
        "contrast",
        "outline",
        "outline secondary",
        "outline contrast",
        "outline notification",
      ],
      control: { type: "select" },
      table: { category: "Props" },
      description: "The class(es) of the badge to apply",
    },
  },
  args: {
    default: "1",
  }, // default value

  // Make sure the badge is visible in the canvas
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const badge = canvas.getAllByRole("status")[0];
    expect(badge).toBeVisible();
  },
};

export default meta;
type Story = StoryObj<typeof BaseBadge>;

export const Default: Story = {
  // The element should be a circle and have a role of status
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByRole("status");
    expect(badge).toBeVisible();
    // Expect the height and width to be close to the same
    expect(badge.getBoundingClientRect().width).toBeCloseTo(
      badge.getBoundingClientRect().height,
      -1
    );
  },
};

export const Empty: Story = {
  args: {
    default: "",
  },
  // The element should be a circle and have a role of status
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByRole("status");
    expect(badge).toBeVisible();
    // Expect the height and width to be close to the same
    expect(badge.getBoundingClientRect().width).toBe(
      badge.getBoundingClientRect().height
    );
  },
};

export const MultiDigit: Story = {
  args: {
    default: "237",
  },
};

export const Busy: Story = {
  args: {
    // @ts-ignore
    ariaBusy: true,
  },
};

export const EmptyBusy: Story = {
  args: {
    default: "",
    // @ts-ignore
    ariaBusy: true,
  },
};

export const WithOverflowingText: Story = {
  args: {
    default: overflowFixture.text,
  },
  // The text in the badge should not be overflowing the badge, and the badge should not be overflowing the screen
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByRole("status");
    const badgeRect = badge.getBoundingClientRect();
    const canvasRect = canvasElement.getBoundingClientRect();

    expect(badgeRect.width).toBeLessThanOrEqual(canvasRect.width);
    expect(badgeRect.height).toBeLessThanOrEqual(canvasRect.height);

    expectTextNotOverflowing(badge);
  },
};

export const WithOverflowingNoSpacesText: Story = {
  args: {
    default: overflowFixture.text_without_spaces,
  },
  // The text in the badge should not be overflowing the badge, and the badge should not be overflowing the screen
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByRole("status");
    const badgeRect = badge.getBoundingClientRect();
    const canvasRect = canvasElement.getBoundingClientRect();

    expect(badgeRect.width).toBeLessThanOrEqual(canvasRect.width);
    expect(badgeRect.height).toBeLessThanOrEqual(canvasRect.height);

    expectTextNotOverflowing(badge);
  },
};

export const LoadingWithOverflowingNoSpacesText: Story = {
  args: {
    default: overflowFixture.text_without_spaces,
    // @ts-ignore
    ariaBusy: true,
  },
  // The text in the badge should not be overflowing the badge, and the badge should not be overflowing the screen
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByRole("status");
    const badgeRect = badge.getBoundingClientRect();
    const canvasRect = canvasElement.getBoundingClientRect();

    expect(badgeRect.width).toBeLessThanOrEqual(canvasRect.width);
    expect(badgeRect.height).toBeLessThanOrEqual(canvasRect.height);

    expectTextNotOverflowing(badge);
  },
};

export const Secondary: Story = {
  args: {
    class: "secondary",
  },
};

export const Contrast: Story = {
  args: {
    class: "contrast",
  },
};

export const Outline: Story = {
  args: {
    class: "outline",
  },
};

export const OutlineSecondary: Story = {
  args: {
    class: "outline secondary",
  },
};

export const OutlineContrast: Story = {
  args: {
    class: "outline contrast",
  },
};

export const LinkAndBadge: Story = {
  args: {
    default: "23",
  },
  decorators: [
    () => ({
      template: `
      <nav>
        <ul>
          <li><a href="#">Inbox<story /></a></li>
          <li><a href="#">Outbox</a></li>
          <li><a href="#">Spam<story class="outline" /></a></li>
          <li><a href="#">Sent</a></li>
        </ul>
      </nav>
      `,
    }),
  ],
};

export const LinkAndBadgeNoNumber: Story = {
  args: {
    default: "",
  },
  decorators: [
    () => ({
      template: `
      <nav>
        <ul>
          <li><a href="#">Inbox<story /></a></li>
          <li><a href="#">Outbox</a></li>
          <li><a href="#">Spam<story class="outline" /></a></li>
          <li><a href="#">Sent</a></li>
        </ul>
      </nav>
      `,
    }),
  ],
};

export const badgeAndButton: Story = {
  args: {
    default: "23",
    class: "contrast",
  },
  decorators: [
    () => ({
      template: `<button>Add Rocketships<story /></button>`,
    }),
  ],
};

export const BadgeWithSVG: Story = {
  args: {
    // @ts-ignore
    ariaLabel: "Heart",
    default: () => [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        h("path", {
          d: "M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z",
        })
      ),
    ],
  },

  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByRole("status");

    // Get the SVG in the badge
    const svg = badge.querySelector("svg");
    expect(svg).toBeVisible();

    if (!svg) {
      return;
    }

    expectElementToBeCentered(svg, badge);
  },
};

export const BadgeWithSVGLoading: Story = {
  args: {
    ariaLabel: "Heart",
    // @ts-ignore
    ariaBusy: true,
    default: () => [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        h("path", {
          d: "M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z",
        })
      ),
    ],
  },
};

export const BadgeWithSVGAndText: Story = {
  args: {
    // @ts-ignore
    ariaLabel: "Heart",
    default: () => [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        h("path", {
          d: "M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z",
        })
      ),
      "Like",
    ],
  },
};
