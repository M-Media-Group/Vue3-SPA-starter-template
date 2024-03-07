import { expect } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3";

import CardElement from "@/components/CardElement.vue";
import { h } from "vue";

import overflowFixture from "../../cypress/fixtures/overflowingData.json";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<typeof CardElement> = {
  title: "Components/CardElement",
  component: CardElement,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  //  Set the router "user.isAuthenticated" to true. We will useUserStore to set the user to authenticated
};

export default meta;
type Story = StoryObj<typeof CardElement>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */

export const Default: Story = {
  args: {
    title: "Hello World",
    subtitle: "Hello World",

    headerActions: "Hello World",
    footer: "Hello World",
    default: "Hello World",
    to: "/somewhere",
  },
};
export const TitleOnly: Story = {
  args: {
    title: "Hello World",
  },
};

export const SubtitleOnly: Story = {
  args: {
    subtitle: "Hello World",
  },
};

export const RightSlotOnly: Story = {
  args: {
    // Fill the headerActions slot with a button
    headerActions: "Hello World",
  },
};

export const AllTitles: Story = {
  args: {
    title: "Hello World",
    subtitle: "Hello World",
  },
};

export const ImagesOnly: Story = {
  args: {
    images: [
      {
        src: "https://picsum.photos/536/354",
        alt: "Placeholder Image",
      },
      {
        src: "https://via.placeholder.com/150",
        alt: "Placeholder Image",
      },
      {
        src: "http://placekitten.com/200/300",
        alt: "Placeholder Image",
      },
    ],
  },

  play: async ({ canvasElement }: any) => {
    const canvas = canvasElement;
    // Get the card, which is an `article` tag
    const article = canvas.querySelector("article");
    const imagesSelector = canvas.querySelector(".images");

    // Wait for each image to load
    await new Promise((resolve) => {
      canvas.querySelectorAll("img").forEach((img: HTMLImageElement) => {
        img.onload = resolve;
      });
    });

    // Ensure that it is possible to scroll left and right in the article
    expect(getComputedStyle(imagesSelector).overflowX).not.toBe("hidden");
    expect(imagesSelector.scrollWidth).toBeGreaterThan(article.clientWidth);

    // Ensure it is not possible to scroll up and down in the article
    expect(imagesSelector.scrollHeight).toBe(article.clientHeight);
  },
};

export const BodyOnly: Story = {
  args: {
    default: "Hello World",
  },
};

export const BodyOnlyWithBold: Story = {
  args: {
    default: () => [h("b", "Hello World"), h("p", "Hello World")],
  },
};

export const HeaderOverwrite: Story = {
  args: {
    header: "Hello World",
  },
};

export const FooterOnly: Story = {
  args: {
    footer: "Hello World",
  },
};

export const Everything: Story = {
  args: {
    title: "Hello World",
    subtitle: "Hello World",
    images: [
      {
        src: "https://picsum.photos/536/354",
        alt: "Placeholder Image",
      },
      {
        src: "https://via.placeholder.com/150",
        alt: "Placeholder Image",
      },
    ],
    headerActions: "Hello World",
    footer: "Hello World",
    default: "Hello World",
    to: "/somewhere",
  },
  play: async ({ canvasElement }: any) => {
    const canvas = canvasElement;
    // Get the card, which is an `article` tag
    const card = canvas.querySelector("article");
    // Ensure that the card does shows a pointer cursor
    expect(getComputedStyle(card).cursor).toBe("pointer");
  },
};

export const EverythingOverflowing: Story = {
  args: {
    title: overflowFixture.text,
    subtitle: overflowFixture.text,
    images: [
      {
        src: "https://picsum.photos/536/354",
        alt: "Placeholder Image",
      },
      {
        src: "https://via.placeholder.com/150",
        alt: "Placeholder Image",
      },
    ],
    headerActions: overflowFixture.text,
    footer: overflowFixture.text,
    default: overflowFixture.text,
    to: "/somewhere",
  },
};

export const LinkingToCurrentPage: Story = {
  args: {
    title: "Hello World",
    subtitle: "Hello World",
    images: [
      {
        src: "https://picsum.photos/536/354",
        alt: "Placeholder Image",
      },
      {
        src: "https://via.placeholder.com/150",
        alt: "Placeholder Image",
      },
    ],
    headerActions: "Hello World",
    footer: "Hello World",
    default: "Hello World",
    to: "/",
  },
};

export const NotClickable: Story = {
  args: {
    title: "Hello World",
    subtitle: "Hello World",
    images: [
      {
        src: "https://picsum.photos/536/354",
        alt: "Placeholder Image",
      },
      {
        src: "https://via.placeholder.com/150",
        alt: "Placeholder Image",
      },
    ],
    headerActions: "Hello World",
    footer: "Hello World",
    default: "Hello World",
    to: undefined,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = canvasElement;
    // Get the card, which is an `article` tag
    const card = canvas.querySelector("article");
    // Ensure that the card does not show a pointer cursor
    expect(getComputedStyle(card).cursor).toBe("auto");
  },
};

export const MultipleCards: Story = {
  decorators: [
    () => ({
      template: `
        <div>
          <story />
          <story />
          <story />
          <story />
          <story />
          <story />
          <story />
        </div>
      `,
    }),
  ],
  args: {
    ...NotClickable.args,
  },
};
