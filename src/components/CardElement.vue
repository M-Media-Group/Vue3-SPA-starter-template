<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  // The title of the card
  title: {
    type: String,
    required: true,
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

    <header>
      <slot name="header">
        <div>
          <h3>{{ title }}</h3>
          <p>{{ subtitle }}</p>
        </div>
        <div class="actions" v-if="$slots.headerActions">
          <slot name="headerActions" />
        </div>
      </slot>
    </header>
    <div class="card-body">
      <slot />
    </div>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </article>
</template>
