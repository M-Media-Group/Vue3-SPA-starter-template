import { normaliseOptions } from "@/helpers/normaliseOptions";
import type { normalisedOptionObject, selectOption } from "@/types/listItem";
import { computed, toRaw } from "vue";

type requiredProps = {
  options: selectOption[];
  displayKey: "id" | "render";
  multiple: boolean;
  modelValue: string[];
  modelKey: "id" | "render";
};

type requiredEmits = (evt: "update:modelValue", args_0: string[]) => void;

// A composable for a multiselect component
export function useMultiselect(props: requiredProps, emit: requiredEmits) {
  // Using the pattern below rather than a computed value gives us a 2x performance improvement

  // eslint-disable-next-line no-secrets/no-secrets
  // Using toRaw so that its not so deeply reactive, this gives us a 10x performance boost. @see and thank https://www.reddit.com/r/vuejs/comments/1bg4266/comment/kv6yece/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
  const normalisedOptions = computed(() => {
    return normaliseOptions(toRaw(props.options));
  });

  const getLabel = (option: selectOption) => {
    if (typeof option === "string") return option;
    return option[props.displayKey];
  };

  /**
   *
   * @param newValue
   * @param valueSelected If the value should be marked as selected or not in the mode value. Of you want the user to be toggle the value on/off with multiple clicks on the same value, set this to false
   * @returns
   */
  const updateModelValue = (newValue: string | null, valueSelected = true) => {
    if (!newValue) {
      return;
    }

    if ((!props.modelValue || !props.multiple) && valueSelected) {
      emit("update:modelValue", [newValue]);
      return;
    }

    // Always emit the full array of selected page IDs
    const newPages = props.modelValue.includes(newValue)
      ? props.modelValue.filter((id) => id !== newValue)
      : [...props.modelValue, newValue];

    emit("update:modelValue", newPages);
  };

  const isOptionSelected = (option: normalisedOptionObject) => {
    return props.modelValue.includes(option[props.modelKey].toString());
  };

  const selectAllOptions = () => {
    const allIds = normalisedOptions.value
      // First skip the disabled options
      .filter((option) => !option.disabled)
      .map((option) => option[props.modelKey]);
    emit("update:modelValue", allIds);
  };

  const unselectAllOptions = () => {
    emit("update:modelValue", []);
  };

  const toggleAllOptions = () => {
    if (props.modelValue.length === normalisedOptions.value.length) {
      return unselectAllOptions();
    }
    return selectAllOptions();
  };

  return {
    normalisedOptions,
    getLabel,
    updateModelValue,
    isOptionSelected,
    selectAllOptions,
    unselectAllOptions,
    toggleAllOptions,
  };
}
