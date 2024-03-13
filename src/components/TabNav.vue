<script setup lang="ts">
import { type PropType, computed } from "vue";
import BaseButton from "./BaseButton.vue";
import type { selectOption } from "@/types/listItem";
import { normaliseOptions } from "@/helpers/normaliseOptions";

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
  pages: {
    type: Array as PropType<selectOption[]>,
    required: true,
  },

  /** Allow multiple selections */
  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const showablePages = computed(() => {
  return normaliseOptions(props.pages);
});

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
      <li v-for="page in showablePages" :key="page.id">
        <base-button
          @click="handleClick(page.id)"
          aria-label="Go to page {{ page.id }}"
          :data-id="page.id"
          :class="{ active: modelValue?.includes(page.id) }"
        >
          {{ page.render }}
        </base-button>
      </li>
    </ul>
  </nav>
</template>
