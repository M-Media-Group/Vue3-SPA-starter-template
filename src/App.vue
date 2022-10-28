<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import { useUserStore } from "./stores/user";

// Using the store, attempt to get the current user
const user = useUserStore();
if (!user.attemptedToFetchUser) {
  user.getUser();
}

// Hook into before route enter to check if the user is authenticated
</script>

<template>
  <NavBar />
  <main>
    <RouterView />
  </main>
</template>
