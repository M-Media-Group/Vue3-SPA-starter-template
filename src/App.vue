<script setup lang="ts">
import PageFooter from "./components/PageFooter.vue";
import NavBar from "./components/NavBar.vue";
import { useUserStore } from "./stores/user";
import { RouterView, useRouter } from "vue-router";
import { ref } from "vue";

// Using the store, attempt to get the current user
const user = useUserStore();

const isReady = ref(false);

if (!user.attemptedToFetchUser) {
  user.getUser();
}

const router = useRouter();

router.isReady().then(() => {
  isReady.value = true;
});
</script>

<template>
  <NavBar />
  <main>
    <RouterView v-if="isReady" />
    <article v-else :aria-busy="true"></article>
  </main>
  <PageFooter />
</template>
