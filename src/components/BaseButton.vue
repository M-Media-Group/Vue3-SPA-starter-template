<script setup lang="ts">
defineProps({
  to: {
    type: String,
    required: false,
  },
});
</script>
<template>
  <a role="button" v-if="$attrs.href">
    <slot />
  </a>

  <router-link v-else-if="to" :to="to" custom v-slot="{ navigate }">
    <button v-bind="$attrs" @click="navigate">
      <slot />
    </button>
  </router-link>

  <button v-else>
    <slot />
  </button>
</template>
