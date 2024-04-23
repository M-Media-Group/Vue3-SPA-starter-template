<script setup lang="ts">
import type { PropType } from "vue";
import BaseButton from "./BaseButton.vue";
import type { selectOption } from "@/types/listItem";
import { useMultiselect } from "@/composables/useMultiselect";

const emit = defineEmits([
  /** The page the user has navigated to, either by clicking directly on a page or by using the previous and next buttons */
  "update:modelValue",
]);

const props = defineProps({
  /** THe modelValue, which is an array of page IDs that are currently active */
  modelValue: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [],
  },

  /** The key to use to determine what value to return in the model */
  modelKey: {
    type: String as PropType<"id" | "render">,
    default: "id",
  },

  /** The pages to show in the tab nav */
  options: {
    type: Array as PropType<selectOption[]>,
    required: true,
  },

  /** Allow multiple selections */
  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },

  /** The key to use for what to display */
  displayKey: {
    type: String as PropType<"id" | "render">,
    default: "render",
  },
});

const { normalisedOptions, getLabel, isOptionSelected, updateModelValue } =
  useMultiselect(props, emit);
</script>
<template>
  <nav aria-label="Tab Navigation" class="tab-nav">
    <ul>
      <li v-for="page in normalisedOptions" :key="page[modelKey]">
        <base-button
          @click="updateModelValue(page[modelKey])"
          :aria-label="`Go to page ${page[modelKey]}`"
          :data-id="page[modelKey]"
          :class="{ active: isOptionSelected(page) }"
          :disabled="page.disabled"
        >
          {{ getLabel(page) }}
        </base-button>
      </li>
    </ul>
  </nav>
</template>
@/stories/Composables/useMultiselect
