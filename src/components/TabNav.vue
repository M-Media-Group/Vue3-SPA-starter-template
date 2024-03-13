<script setup lang="ts">
import type { PropType } from "vue";
import BaseButton from "./BaseButton.vue";
import type { selectOption } from "@/types/listItem";
import { useMultiselect } from "@/stories/Composables/multiselect";

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

const { normalisedOptions, getLabel } = useMultiselect(props);

const handleClick = (pageId: string) => {
  if (!pageId) {
    return;
  }

  if (!props.multiple) {
    emit("update:modelValue", [pageId]);
    return;
  }

  // Always emit the full array of selected page IDs
  const newPages = props.modelValue.includes(pageId)
    ? props.modelValue.filter((id) => id !== pageId)
    : [...props.modelValue, pageId];

  emit("update:modelValue", newPages);
};
</script>
<template>
  <nav aria-label="Tab Navigation" class="tab-nav">
    <ul>
      <li v-for="page in normalisedOptions" :key="page.id">
        <base-button
          @click="handleClick(page.id)"
          aria-label="Go to page {{ page.id }}"
          :data-id="page.id"
          :class="{ active: modelValue?.includes(page.id) }"
        >
          {{ getLabel(page) }}
        </base-button>
      </li>
    </ul>
  </nav>
</template>
