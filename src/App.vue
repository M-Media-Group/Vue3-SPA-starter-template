<script setup lang="ts">
import PageFooter from "./components/PageFooter.vue";
import NavBar from "./components/NavBar.vue";
import { RouterView, useRouter } from "vue-router";
import { ref } from "vue";
import { navIsLoading } from "./router";

const isReady = ref(import.meta.env.SSR ?? false);

const router = useRouter();

router.isReady().then(() => {
  isReady.value = true;
});
</script>

<template>
  <Transition>
    <progress
      v-if="!isReady || navIsLoading"
      class="page-progress"
      :indeterminate="true"
    />
  </Transition>
  <NavBar />
  <main>
    <RouterView v-if="isReady" />
    <article v-else :aria-busy="true"></article>
  </main>
  <PageFooter />
</template>
