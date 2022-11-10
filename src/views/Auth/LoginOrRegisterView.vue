<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import LoginOrRegister from "@/forms/LoginOrRegister.vue";
import router from "@/router";

const redirect = () => {
  // Redirect to the home page
  router.push((router.currentRoute.value.query.redirect as string) ?? "/");
};
</script>

<template>
  <h1>{{ $t("Authenticate") }}</h1>
  <CardElement :title="$t('Connect')">
    <LoginOrRegister @success="redirect" />
  </CardElement>
</template>
