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
  <card-element :titleHeadingLevel="2" :title="$t('Connect')">
    <login-or-register @success="redirect" />
  </card-element>
</template>
