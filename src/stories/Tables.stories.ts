// This story tests the body, h1-h6
// We will use just the native h1-h6 tags for this story
import type { Meta, StoryObj } from "@storybook/vue3";

type HTMLInputElementCustom = HTMLTableElement & {
  columnsToShow?: number;
  rowsToShow?: number;
  cellText?: string;
  striped?: boolean;
};

const meta: Meta<HTMLInputElementCustom> = {
  title: "Components/Table",

  tags: ["autodocs"],

  argTypes: {
    striped: {
      control: {
        type: "boolean",
      },
      description:
        "If the table should be striped by adding the class `striped` to the table element",
    },
  },
  args: {
    columnsToShow: 5,
    rowsToShow: 10,
    cellText: "cell",
    striped: false,
  },
};

export default meta;
type Story = StoryObj<HTMLInputElementCustom>;

export const Table: Story = {
  render: ({ columnsToShow, rowsToShow, cellText, striped }) => ({
    template: `
      <table class="${striped ? "striped" : ""}">
        <thead>
            <tr>
                ${Array(columnsToShow)
                  .fill(null)
                  .map(() => "<th>Column</th>")
                  .join("")}
            </tr>
        </thead>
        <tbody>
            ${Array(rowsToShow)
              .fill(null)
              .map(
                () => `
                        <tr>
                            ${Array(columnsToShow)
                              .fill(null)
                              .map(() => `<td>${cellText}</td>`)
                              .join("")}
                        </tr>
                    `
              )
              .join("")}
        </tbody>
        </table>
    `,
  }),
};
