import { expect, within } from "@storybook/test";

export const sharedInputArgTypes = {
  name: {
    control: "text",
    description: "The name of the input",
    table: { category: "Props" },
  },
  value: {
    control: "text",
    description: "The value of the input",
    table: { category: "Props" },
  },
  disabled: {
    control: "boolean",
    description: "If the input is disabled",
    table: { category: "Props" },
  },
  // aria-invalid can be true, false, or undefined
  ariaInvalid: {
    // We need 3 options, true, false, and undefined
    options: [true, false, undefined],
    control: { type: "select" },
    description:
      "If the input is invalid. If false, the input is valid. If undefined, the input is neither valid nor invalid",
    table: { category: "Props" },
  },
  helpText: {
    control: "text",
    description:
      "The help text of the input. To include this in your code, you need to add a <small> tag right after the input",
  },
  required: {
    control: "boolean",
    description: "If the input is required",
    table: { category: "Props" },
  },
  readOnly: {
    control: "boolean",
    description: "If the input is read only",
    table: { category: "Props" },
  },
};

export const sharedInputArgs = {
  name: "Input element",
  required: true,
  disabled: false,
  readOnly: false,
  helpText: "This is a help text",
};

export const sharedDecorators = (
  story: any,
  { args }: { args: typeof sharedInputArgs }
) => ({
  template: `${
    args.name ? `<label for="input">${args.name}</label>` : ""
  }<story />
      ${args.helpText ? `<small>${args.helpText}</small>` : ""}`,
});

export const sharedTests = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const input = canvas.getAllByTestId("input")[0];
  expect(input).toBeVisible();
};
