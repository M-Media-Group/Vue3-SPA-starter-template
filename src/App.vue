<script setup lang="ts">
import PageFooter from "./components/PageFooter.vue";
import NavBar from "./components/NavBar.vue";
import { useUserStore } from "./stores/user";
import { RouterView } from "vue-router";

// Using the store, attempt to get the current user
const user = useUserStore();
if (!user.attemptedToFetchUser) {
  user.getUser();
}
</script>

<template>
  <NavBar />
  <main>
    <RouterView />
  </main>
  <PageFooter />
</template>
