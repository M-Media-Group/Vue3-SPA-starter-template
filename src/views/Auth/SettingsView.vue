<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import AccountSettings from "@/forms/AccountSettings.vue";
</script>
<template>
  <h1>{{ $t("My Account") }}</h1>
  <CardElement :title="$t('Settings')">
    <AccountSettings></AccountSettings>
  </CardElement>
  <CardElement :title="$t('Payment methods')"> </CardElement>
  <CardElement :title="$t('Previous rentals')"> </CardElement>
  <CardElement :title="$t('Get help')"> </CardElement>
</template>
