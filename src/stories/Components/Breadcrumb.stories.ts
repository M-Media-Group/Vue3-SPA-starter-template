import type { Meta, StoryObj } from "@storybook/vue3";

type HTMLBreadcrumbElement = HTMLElement & {
  links: { href?: string; text: string }[];
};

const meta: Meta<HTMLBreadcrumbElement> = {
  title: "Components/Breadcrumb",

  tags: ["autodocs"],

  args: {
    links: [
      { href: "#", text: "Home" },
      { href: "#", text: "Services" },
      { text: "Design" },
    ],
  },

  argTypes: {
    links: {
      description: "An array of objects with `href` and `text` properties",
    },
  },

  render: ({ links }) => ({
    template: `
      <nav aria-label="breadcrumb">
        <ul>
          ${links
            .map(
              (link) => `
              <li>
                ${
                  link.href
                    ? `<a href="${link.href}">${link.text}</a>`
                    : link.text
                }
              </li>
            `
            )
            .join("")}
        </ul>
      </nav>
    `,
  }),
};

export default meta;
type Story = StoryObj<HTMLBreadcrumbElement>;

export const Breadcrumb: Story = {};
