<script setup lang="ts">
defineProps({
  /**
   * Where to navigate to. If not set, this component will render a link with the role button. The slot content will be responsible for the actual linking.
   */
  to: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
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

  <router-link v-else-if="to" :to="to" custom v-slot="{ navigate }">
    <button
      v-bind="$attrs"
      @click="navigate"
      :disabled="disabled ? disabled : undefined"
    >
      <!-- @slot This is the default slot which contains the text.  -->
      <slot />
    </button>
  </router-link>

  <button v-else :disabled="disabled ? disabled : undefined">
    <slot />
  </button>
</template>
