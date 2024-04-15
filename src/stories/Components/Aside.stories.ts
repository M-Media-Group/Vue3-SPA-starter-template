import type { Meta, StoryObj } from "@storybook/vue3";

type HTMLAsideElement = HTMLElement & {
  links: { href?: string; text: string }[];
};

const meta: Meta<HTMLAsideElement> = {
  title: "Components/Aside",

  tags: ["autodocs"],

  args: {
    links: [
      { href: "#", text: "About" },
      { href: "#", text: "Services" },
      { href: "#", text: "Products" },
    ],
  },

  argTypes: {
    links: {
      description: "An array of objects with `href` and `text` properties",
    },
  },

  render: ({ links }) => ({
    template: `
      <aside>
        <nav>
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
      </aside>
    `,
  }),
};

export default meta;
type Story = StoryObj<HTMLAsideElement>;

export const Aside: Story = {};
