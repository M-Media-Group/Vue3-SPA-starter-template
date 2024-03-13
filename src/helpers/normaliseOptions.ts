import type { normalisedOptionObject, selectOption } from "@/types/listItem";

/** Since we support either a callback or a string, we need to normalize the options to always have a render function */
export const normaliseOptions = (
  options?: selectOption[]
): normalisedOptionObject[] => {
  if (!options) return [];

  // We will use a straight for loop for performance
  const normalisedOptions = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (typeof option === "string") {
      normalisedOptions.push({
        id: option,
        render: option,
      });
      continue;
    }
    normalisedOptions.push({
      id: option.id.toString(),
      render: option.render,
      raw: option.raw,
    });
  }
  return normalisedOptions;
};

export const filterOptions = (
  options: ReturnType<typeof normaliseOptions>,
  value: string,
  key = "render" as keyof ReturnType<typeof normaliseOptions>[0]
) => {
  // If the value is empty or the key is unsupported, return all options
  if (value.trim() === "" || key === "raw") {
    return options;
  }

  const lowercaseValue = value.toLowerCase();

  return options.filter((option) => {
    const optionValue = option[key];
    return optionValue && optionValue.toLowerCase().includes(lowercaseValue);
  });
};

export const orderOptionsBySelectedFirst = (
  options: ReturnType<typeof normaliseOptions>,
  selected: string[],
  key = "render" as keyof ReturnType<typeof normaliseOptions>[0]
) => {
  return options.sort((a, b) => {
    // If the value is empty, return all options
    if (selected.length === 0) {
      return 0;
    }

    // run a fast find with loop and index access
    for (let i = 0; i < selected.length; i++) {
      const selectedValue = selected[i];
      if (a[key] == selectedValue) {
        return -1;
      }
      if (b[key] == selectedValue) {
        return 1;
      }
    }
    return 0;
  });
};
