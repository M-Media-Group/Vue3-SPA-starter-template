import { normaliseOptions } from "@/helpers/normaliseOptions";
import type { normalisedOptionObject, selectOption } from "@/types/listItem";
import { ref, watch } from "vue";

type requiredProps = {
  options: selectOption[];
  displayKey: "id" | "render";
};

// A composable for a multiselect component
export function useMultiselect(props: requiredProps) {
  const normalisedOptions = ref<normalisedOptionObject[]>([]);

  watch(
    () => props.options,
    () => {
      normalisedOptions.value = normaliseOptions(props.options);
    },
    {
      immediate: true,
    }
  );

  const getLabel = (option: selectOption) => {
    if (typeof option === "string") return option;
    return option[props.displayKey];
  };

  return {
    normalisedOptions,
    getLabel,
  };
}
