<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import AccountSettings from "@/forms/AccountSettings.vue";
import AddPaymentMethod from "@/forms/AddPaymentMethod.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const handleUpdate = (event: { email: any }) => {
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
  <CardElement :title="$t('Payment methods')">
    <div v-if="userStore.user?.pm_type">
      <p>
        {{ $t("Default payment method") }}:
        {{ userStore.user.pm_type.toUpperCase() }} ****
        {{ userStore.user.pm_last_four }}
      </p>
    </div>
    <AddPaymentMethod />
  </CardElement>
  <!-- <CardElement :title="$t('Payment methods')"> </CardElement>
  <CardElement :title="$t('Previous rentals')"> </CardElement>
  <CardElement :title="$t('Get help')"> </CardElement> -->
</template>
