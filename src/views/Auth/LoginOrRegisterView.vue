<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import LoginOrRegister from "@/forms/LoginOrRegister.vue";
import router from "@/router";

const redirect = () => {
  // Redirect to the home page
  router.push("/");
};

const appName = import.meta.env.VITE_APP_NAME;
</script>

<template>
  <h1>Authenticate</h1>
  <CardElement title="Connect">
    <LoginOrRegister @authenticated="redirect" />
  </CardElement>
</template>
