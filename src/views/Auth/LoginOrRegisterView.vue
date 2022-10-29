<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import LoginOrRegister from "@/forms/LoginOrRegister.vue";
import router from "@/router";

const redirect = () => {
  // Redirect to the home page
  router.push("/");
};
</script>

<template>
  <h1>Authenticate</h1>
  <CardElement title="Connect">
    <template #header>
      <h1>Scan & Paddle</h1>
      <p>Find a board, scan the code, and paddle on!</p>
    </template>
    <LoginOrRegister @authenticated="redirect" />
  </CardElement>
</template>
