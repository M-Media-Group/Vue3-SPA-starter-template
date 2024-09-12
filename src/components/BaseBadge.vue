<script setup lang="ts">
import type { BadgeObject } from "@/types/badge";
import type { PropType } from "vue";

defineProps({
  /**
   * The aria-label for the badge. If not set and the value is numeric, it will default to `${value} New Notifications`.
   */
  ariaLabel: {
    type: String,
    required: false,
    default: "New Notification",
  },

  /** The class to use */
  class: {
    type: String as PropType<BadgeObject["className"]>,
    required: false,
  },
});
</script>
<template>
  <span
    role="status"
    v-bind="$attrs"
    :aria-label="ariaLabel"
    :class="$props.class"
  >
    <!-- @slot This is the text or number to display in the badge -->
    <slot />
  </span>
</template>
