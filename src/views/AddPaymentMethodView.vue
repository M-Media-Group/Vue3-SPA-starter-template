<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import AddPaymentMethod from "@/forms/AddPaymentMethod.vue";
import router from "@/router";

const added = () => {
  router.push((router.currentRoute.value.query.redirect as string) ?? "/");
};
</script>
<template>
  <h1>{{ $t("Add a payment method") }}</h1>
  <CardElement :title="$t('Payment methods')">
    <AddPaymentMethod @success="added" />
  </CardElement>
</template>
