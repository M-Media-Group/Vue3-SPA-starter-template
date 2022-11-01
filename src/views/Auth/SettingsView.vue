<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import AccountSettings from "@/forms/AccountSettings.vue";
import router from "@/router";

const handleUpdate = (event: { email: any }) => {
  console.log("Got updated event", event);
  // If the email is in the event, redirect to the confirm email page
  if (event.email) {
    router.push({ name: "confirm-email" });
  }
};
</script>
<template>
  <h1>{{ $t("My Account") }}</h1>
  <CardElement :title="$t('Settings')">
    <AccountSettings @updated="handleUpdate"></AccountSettings>
  </CardElement>
  <!-- <CardElement :title="$t('Payment methods')"> </CardElement>
  <CardElement :title="$t('Previous rentals')"> </CardElement>
  <CardElement :title="$t('Get help')"> </CardElement> -->
</template>
