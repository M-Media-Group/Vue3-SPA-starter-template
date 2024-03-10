export type selectOptionObject = {
  id: string | number;
  //   The render is either a string or a function that returns a string
  render: string | (() => string);
  selected?: boolean;
  disabled?: boolean;
};

// Normalised select is the same as above, except the render which is always a string
export type normalisedOptionObject = Omit<selectOptionObject, "render"> & {
  render: string;
  id: string;
};

export type selectOption = selectOptionObject | string;