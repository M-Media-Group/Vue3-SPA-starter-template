<script setup lang="ts">
import {
  filterOptions,
  normaliseOptions,
  orderOptionsBySelectedFirst,
} from "@/helpers/normaliseOptions";
import type { selectOption, selectOptionObject } from "@/types/listItem";
import { type PropType, computed, onMounted, ref, watch } from "vue";

const props = defineProps({
  /** The model value is an array of selected options. This element will always use an array of strings as the values, even if originally they are typed as numbers. This is to stay consistent with native HTML elements "value" behaviour. This may be changed in the future. */
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },

  /** The key to use to determine what value to return in the model */
  modelKey: {
    type: String as PropType<keyof selectOptionObject>,
    default: "id",
  },

  /** The key to use to determine the value to display */
  displayKey: {
    type: String as PropType<keyof selectOptionObject>,
    default: "render",
  },

  /** The passed options */
  options: {
    type: Array as PropType<selectOption[]>,
  },

  /** Whether the select is open or not */
  isOpen: {
    type: Boolean,
    default: false,
  },

  /** Show a select-all option */
  selectAll: {
    type: Boolean,
    default: false,
  },

  /** allow multiple selections */
  multiple: {
    type: Boolean,
    default: false,
  },

  /** The placeholder text to show */
  placeholder: {
    type: String,
    default: "Select an option",
  },

  /** Show search */
  searchable: {
    type: Boolean,
    default: false,
  },

  /** The search value. This is two-way binded so you should use a v-nodel for this to work */
  search: {
    type: String,
    default: "",
  },

  /** Limit visible elements. Its recommended to use this at a fairly low number and encourage the user to use the search. This limits how many HTML elements are rendered, but not how many are in the options array. */
  visibleLimit: {
    type: Number,
    default: 25,
  },

  /** Search encouragement text */
  searchEncouragement: {
    type: String,
    default: "Search to see more results",
  },

  /** Show the selected options first in the list */
  showSelectedFirst: {
    type: Boolean,
    default: false,
  },

  /** The role of the dropdown (button or undefined) */
  role: {
    type: String,
    default: undefined,
    validator: (value: string) => value === "button" || value === undefined,
  },

  /** The aria-invalid attribute */
  ariaInvalid: {
    type: Boolean,
    default: undefined,
  },

  /** The aria-busy attribute */
  ariaBusy: {
    type: Boolean,
    default: undefined,
  },

  /** Disable the entire dropdown */
  disabled: {
    type: Boolean,
    default: false,
  },

  /** If it is required to choose a value */
  required: {
    type: Boolean,
    default: false,
  },

  /** The select-all text */
  selectAllText: {
    type: String,
    default: "Select all",
  },

  /** The text to show when loading results */
  loadingText: {
    type: String,
    default: "Loading...",
  },
  /** If the search should autofocus on open */
  autofocus: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "update:search",
  "reachedEndOfList",
]);

const updateModelValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  if ((!props.modelValue || !props.multiple) && target.checked) {
    emit("update:modelValue", [value]);
    return;
  }

  if (target.checked) {
    emit("update:modelValue", [...props.modelValue, value]);
    return;
  }

  emit(
    "update:modelValue",
    props.modelValue.filter((v) => v !== value)
  );
};

const handleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    emit(
      "update:modelValue",
      props.options?.map((option) => {
        return typeof option === "string" ? option : option.id.toString();
      }) ?? []
    );
  } else {
    emit("update:modelValue", []);
  }
};

let normalisedOptions = normaliseOptions(props.options);

watch(
  () => props.options,
  () => {
    normalisedOptions = normaliseOptions(props.options);
  }
);

const filteredOptions = computed(() => {
  if (!props.options) return [];

  return filterOptions(normalisedOptions, props.search);
});

const orderedOptions = computed(() => {
  if (!props.options) return [];

  if (!props.showSelectedFirst) {
    return filteredOptions.value;
  }

  return orderOptionsBySelectedFirst(
    filteredOptions.value,
    props.modelValue,
    props.modelKey
  );
});

const showSelectAll = computed(() => {
  if (!props.selectAll) return false;
  if (!props.options) return false;
  if (!props.multiple) return false;
  // If we are in search, we don't show it because we don't want to confuse the user user about what is being selected
  if (props.search) return false;
  return true;
});

const getLabel = (option: selectOption) => {
  if (typeof option === "string") return option;
  return option[props.displayKey];
};

/** Logic to setup the listening of when the user reached teh nottom of the dropdown list */
const dropdownList = ref<HTMLUListElement | null>(null);

const setupDropdownList = () => {
  if (!dropdownList.value) return;

  dropdownList.value.addEventListener("scroll", () => {
    if (!dropdownList.value) return;
    if (
      dropdownList.value.scrollTop + dropdownList.value.clientHeight >=
      dropdownList.value.scrollHeight
    ) {
      emit("reachedEndOfList");
    }
  });
};

const searchInput = ref<HTMLInputElement | null>(null);

/** A dunction to handle the opening of the results. If the search is present, we autofocus the search input */
const openResults = async () => {
  if (!props.isOpen) return;
  if (!props.searchable) return;
  if (!searchInput.value) return;
  if (!props.autofocus) return;
  // Wait for the next tick to focus the input
  searchInput.value?.focus();
};

onMounted(() => {
  setupDropdownList();
});

const getSummaryText = () => {
  if (props.modelValue.length > 0) {
    return props.modelValue
      .map((value) => {
        const option = normalisedOptions.find((option) =>
          typeof option === "string" ? option === value : option.id === value
        );
        return option
          ? getLabel(option)
          : value.trim() !== ""
          ? value
          : props.placeholder;
      })
      .join(", ");
  }

  return props.placeholder;
};
</script>
<template>
  <details class="dropdown" :open="props.isOpen" @toggle="openResults">
    <summary
      :role="props.role"
      :aria-invalid="props.ariaInvalid"
      :aria-busy="props.ariaBusy"
    >
      {{ props.modelValue.length > 0 ? getSummaryText() : props.placeholder }}
    </summary>
    <ul ref="dropdownList">
      <li v-if="props.searchable">
        <input
          type="search"
          :value="props.search"
          @input="
            $emit('update:search', ($event.target as HTMLInputElement).value)
          "
          :aria-busy="props.ariaBusy"
          aria-label="Search for an option"
          autofocus
          ref="searchInput"
        />
      </li>
      <li v-if="showSelectAll">
        <label>
          <input
            type="checkbox"
            :checked="props.modelValue.length === props.options?.length"
            @click="handleSelectAll"
            :disabled="props.disabled"
            value="all"
          />
          {{ props.selectAllText }}
        </label>
      </li>

      <li
        v-for="option in orderedOptions?.slice(0, props.visibleLimit)"
        :key="typeof option === 'string' ? option : option.id"
      >
        <slot
          name="optionSlot"
          :option="option"
          :checked="
            props.modelValue?.includes(
              typeof option === 'string' ? option : option.id.toString()
            )
          "
          :updateModelValue="updateModelValue"
          :modelValue="props.modelValue"
        >
          <label>
            <input
              type="checkbox"
              :disabled="props.disabled"
              :value="typeof option === 'string' ? option : option.id"
              :checked="
                props.modelValue.includes(
                  typeof option === 'string' ? option : option.id.toString()
                )
              "
              @click="updateModelValue"
            />
            {{ typeof option === "string" ? option : option[displayKey] }}
          </label>
        </slot>
      </li>

      <li v-if="ariaBusy" aria-busy="true">{{ props.loadingText }}</li>
      <!-- if the results are limited because of the visible limit, but there are more filteredResults, show a message -->
      <li v-if="filteredOptions.length > props.visibleLimit">
        {{ props.searchEncouragement }}
      </li>
    </ul>
  </details>
</template>
<style scoped>
ul {
  max-height: 400px;
  overflow-y: auto;
  list-style: none;
}
</style>
