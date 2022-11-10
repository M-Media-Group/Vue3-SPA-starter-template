<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import ConfirmPassword from "@/forms/ConfirmPassword.vue";
import router from "@/router";

const redirect = () => {
  // Redirect to the home page
  router.push((router.currentRoute.value.query.redirect as string) ?? "/");
};
</script>

<template>
  <h1>{{ $t("Confirm your password") }}</h1>
  <CardElement :title="$t('Confirm your password')">
    <ConfirmPassword @success="redirect" />
  </CardElement>
</template>
