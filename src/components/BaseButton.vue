<script setup lang="ts">
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

defineProps({
  /**
   * Where to navigate to. If not set, this component will render a link with the role button. The slot content will be responsible for the actual linking.
   */
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    required: false,
  },
  /**
   * Whether the button is disabled or not. If true, a disabled attribute will be added to the element, otherwise it will not be added.
   */
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  /**
   * The type of the button. If not set, it will default to `button`.
   */
  type: {
    type: String as PropType<"button" | "submit" | "reset">,
    required: false,
    default: "button",
  },
});
</script>
<template>
  <a
    role="button"
    v-if="$attrs.href"
    :disabled="disabled ? disabled : undefined"
  >
    <!-- @slot This is the text or content that is clickable and navigates. This is the slot inside the `<a>` tag if href is present. This component automatically sets the href or to attributes for navigation for you. It renders as an `<a>` tag with a `role=button` if its `href`, otherwise its a button if `to` is passed. -->
    <slot />
  </a>

  <router-link v-else-if="to" :to="to" custom v-slot="{ navigate, href }">
    <a
      v-bind="$attrs"
      @click="navigate"
      :disabled="disabled ? disabled : undefined"
      role="button"
      :href="href"
    >
      <!-- @slot This is the default slot which contains the text.  -->
      <slot />
    </a>
  </router-link>

  <button v-else :disabled="disabled ? disabled : undefined" :type="type">
    <slot />
  </button>
</template>
