import type { Badge } from "./badge";

export type selectOptionObject = {
  id: string | number;
  //   The render is either a string or a function that returns a string
  render: string;
  disabled?: boolean;
  raw?: any;
  badge?: Badge;
};

// Normalised select is the same as above, except the render which is always a string
export type normalisedOptionObject = Omit<selectOptionObject, "id"> & {
  id: string;
};

export type selectOption = selectOptionObject | string;
