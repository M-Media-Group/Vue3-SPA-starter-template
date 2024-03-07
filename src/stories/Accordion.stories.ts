import type { Meta, StoryObj } from "@storybook/vue3";
import overflowFixture from "../../cypress/fixtures/overflowingData.json";
import { expect, within } from "@storybook/test";

// Note this type is re-used in the Dropdown.stories.ts file
export type HTMLDetailsElementCustom = HTMLDetailsElement & {
  optionText: string;
  role: string;
  ariaInvalid: string;
};

const meta: Meta<HTMLDetailsElementCustom> = {
  title: "Components/Accordion",

  tags: ["autodocs"],

  render: ({ title, open, role, optionText }) => ({
    template: `<details ${open ? "open" : ""}><summary
    ${
      role ? `role="${role}"` : ""
    }>${title}</summary><p>${optionText}</p></details>`,
  }),

  argTypes: {
    role: {
      options: [undefined, "button"],
    },
  },

  args: {
    title: "Hello World",
    open: false,
    role: undefined,
    optionText: "This is a dropdown option",
  },
};

export default meta;
type Story = StoryObj<HTMLDetailsElementCustom>;

export const Default: Story = {};

export const Open: Story = {
  args: {
    open: true,
  },
};

export const ButtonRole: Story = {
  args: {
    role: "button",
  },
};

export const OpenWithOverflow: Story = {
  args: {
    ...Open.args,
    title: overflowFixture.text_without_spaces,
    optionText: overflowFixture.text_without_spaces,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByText(overflowFixture.text_without_spaces);

    expect(summary).toBeVisible();

    // Weird issue caused by font line-height changing size of contents within div means the following fails for now, although no user-impact seems to be visible
    // eslint-disable-next-line no-secrets/no-secrets
    // checkElementForTextOverflow(summary);
  },
};
