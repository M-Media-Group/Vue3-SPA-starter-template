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

// An advanced table where a row has the columns with a: checkbox, image, text-input, select, and a button
export const AdvancedTable: Story = {
  args: {
    columnsToShow: 7,
  },
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
                            <td><input type="checkbox"></td>
                            <td><img src="https://via.placeholder.com/150"></td>
                            <td><input type="text" value="${cellText}"></td>
                            <td>
                                <select>
                                    <option>Option 1</option>
                                    <option>Option 2</option>
                                    <option>Option 3</option>
                                </select>
                            </td>
                            <td><button>Click me</button></td>
                            <td>153,000</td>
                            <td><input type="checkbox" role="switch"></td>
                        </tr>
                    `
              )
              .join("")}
        </tbody>
        </table>
    `,
  }),
};
