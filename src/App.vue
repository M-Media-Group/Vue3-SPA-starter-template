<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import PageFooter from "./components/PageFooter.vue";
import { useUserStore } from "./stores/user";

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
