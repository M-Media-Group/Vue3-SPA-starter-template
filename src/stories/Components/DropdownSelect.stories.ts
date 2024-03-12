import type { Meta, StoryObj } from "@storybook/vue3";
import DropdownSelect from "@/components/DropdownSelect.vue";
import {
  sharedDecorators,
  sharedInputArgTypes,
  sharedInputArgs,
} from "../Inputs/SharedInputArgs";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof DropdownSelect> = {
  title: "Components/DropdownSelect",

  tags: ["autodocs"],

  component: DropdownSelect,

  render: (args) => ({
    components: { DropdownSelect },
    setup() {
      return { args };
    },
    template:
      "<dropdown-select v-bind='args' v-model='args.modelValue' v-model:search=args.search v-model:isOpen=args.isOpen><template v-if=args.optionSlot #optionSlot>{{args.optionSlot}}</template></dropdown-select>",
  }),

  argTypes: {
    ...sharedInputArgTypes,
    isOpen: {
      control: "boolean",
      description: "Whether the dropdown is open",
      table: { category: "Props" },
    },
    role: {
      options: [undefined, "button"],
    },
  },

  args: {
    ...sharedInputArgs,
    isOpen: false,
    role: undefined,
    options: ["Option 1", "Option 2", "Option 3"],
  },

  // @ts-ignore
  decorators: [sharedDecorators],
};

export default meta;
type Story = StoryObj<typeof DropdownSelect>;

export const Default: Story = {};

export const Open: Story = {
  args: {
    isOpen: true,
  },
};

export const ButtonRole: Story = {
  args: {
    role: "button",
  },
};

export const WithSingleSelect: Story = {
  args: {
    isOpen: true,
    multiple: false,
    options: [
      "Text Only 1",
      "Text Only 2",
      {
        id: "id3",
        render: "Object 3",
      },
      {
        id: 4,
        render: "Object 4",
      },
    ],
  },
};

export const WithMultiSelect: Story = {
  args: {
    isOpen: true,
    multiple: true,
    selectAll: true,
    placeholder: "Select some options",
    options: [
      "Text Only 1",
      "Text Only 2",
      {
        id: "id1",
        render: "Object 3",
      },
      {
        id: 4,
        render: "Object 4",
      },
    ],
  },
};

export const WithCheckboxesAndHundredOptions: Story = {
  args: {
    isOpen: true,
    multiple: true,
    searchable: true,
    showSelectedFirst: true,
    selectAll: true,
    autofocus: true,
    options: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      render: `Option ${i}`,
    })),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    // Click on the summary to open the dropdown
    const firstOption = canvas.getByDisplayValue("0");
    expect(firstOption).not.toHaveFocus();

    // Pressing tab should focus on the summary
    await userEvent.tab();

    // The input element should be focused. The input element has a "search" role
    const input = canvas.getByPlaceholderText("Search for an option");
    // await expect(input).toHaveFocus();

    // Input some text
    await userEvent.type(input, "Option");

    // When pressing tab, the focus should move to the first option
    await userEvent.tab();
    expect(firstOption).toHaveFocus();

    // Pressing tab again should go to the next option
    await userEvent.tab();
    const secondOption = canvas.getByDisplayValue("1");
    expect(secondOption).toHaveFocus();

    // It should be possible to check it with the space key
    expect(secondOption).not.toBeChecked();
    await userEvent.type(secondOption, " ");
    expect(secondOption).toBeChecked();
  },
};

export const WithCheckboxesAndThousandOptions: Story = {
  args: {
    isOpen: true,
    multiple: true,
    searchable: true,
    showSelectedFirst: true,
    options: Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      render: `Option ${i}`,
    })),
  },
};

export const WithCheckboxesButNoDataAndLoading: Story = {
  args: {
    options: [],
    ariaBusy: true,
  },
};

export const WithCustomDataInOptionSlot: Story = {
  args: {
    isOpen: true,
    options: [
      {
        id: "id1",
        render: "Option 1",
      },
      {
        id: "id2",
        render: "Option 2",
      },
    ],

    optionSlot: `With slot taken over`,
  },
};
