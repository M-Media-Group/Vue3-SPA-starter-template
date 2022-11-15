<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  // The title of the card
  title: {
    type: String,
    required: false,
  },
  // The subtitle of the card
  subtitle: {
    type: String,
    required: false,
  },
  // The image of the card
  images: {
    // Images is an array of images, each image contains src and alt
    type: Array as PropType<{ src: string; alt: string }[]>,
    required: false,
  },
});
</script>

<template>
  <article>
    <div class="images" v-if="images">
      <img
        v-for="image in images"
        :src="image.src"
        :alt="image.alt"
        :key="image.alt"
      />
    </div>

    <header v-if="title || subtitle || $slots.headerActions || $slots.header">
      <slot name="header">
        <div>
          <h3 v-if="title">{{ title }}</h3>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <div class="actions" v-if="$slots.headerActions">
          <slot name="headerActions" />
        </div>
      </slot>
    </header>
    <div>
      <slot />
    </div>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </article>
</template>
