import type { selectOption } from "@/types/listItem";

/** Since we support either a callback or a string, we need to normalize the options to always have a render function */
export const normaliseOptions = (options?: selectOption[]) => {
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
    } else {
      normalisedOptions.push({
        ...option,
        id: option.id.toString(),
        render:
          typeof option.render === "function" ? option.render() : option.render,
      });
    }
  }
  return normalisedOptions;
};

export const filterOptions = (
  options: ReturnType<typeof normaliseOptions>,
  value: string,
  key = "render" as keyof ReturnType<typeof normaliseOptions>[0]
) => {
  // If the value is empty, return all options
  if (value === "" || value === " ") {
    return options;
  }

  // Use a for loop for performance
  const filteredOptions = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    let optionValue = option[key];

    if (!optionValue) continue;

    // If its a boolean or number, we need to convert it to a string
    if (typeof optionValue !== "string") {
      optionValue = optionValue.toString();
    }

    if (optionValue.toLowerCase().includes(value.toLowerCase())) {
      filteredOptions.push(option);
    }
  }
  return filteredOptions;
};

export const orderOptions = (
  options: ReturnType<typeof normaliseOptions>,
  value: string
) => {
  return options.sort((a, b) => {
    // If the value is empty, return all options
    if (value === "") {
      return 0;
    }

    // Current v-model value
    return a.render.toLowerCase().includes(value.toLowerCase()) ? -1 : 1;
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
