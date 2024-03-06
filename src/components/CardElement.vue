<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  /** The title of the card */
  title: {
    type: String,
    required: false,
  },
  /** The subtitle of the card */
  subtitle: {
    type: String,
    required: false,
  },
  /** The images to display in the card */
  images: {
    // Images is an array of images, each image contains src and alt
    type: Array as PropType<{ src: string; alt: string }[]>,
    required: false,
  },
  /** Where the card should navigate to. If not set, the card is not clickable */
  to: {
    type: String,
    required: false,
  },
  /** The heading level to use, between 1 and 6. This has no effect if the title is not set or the header slot is used. */
  titleHeadingLevel: {
    type: Number,
    required: false,
    default: 3,
    validator: (value: number) => value >= 1 && value <= 6,
  },
});
</script>

<template>
  <component :is="to ? 'router-link' : 'vue:template'" :to="to">
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
            <component :is="`h${titleHeadingLevel}`" v-if="title">{{
              title
            }}</component>
            <p v-if="subtitle">{{ subtitle }}</p>
          </div>
          <div class="actions" v-if="$slots.headerActions">
            <!-- @slot This is the slot for the header actions - which is on the right side of the card in the header. -->
            <slot name="headerActions" />
          </div>
        </slot>
      </header>

      <slot />

      <footer v-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </article>
  </component>
</template>
