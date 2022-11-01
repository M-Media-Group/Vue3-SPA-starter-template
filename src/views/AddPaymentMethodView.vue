<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import AddPaymentMethod from "@/forms/AddPaymentMethod.vue";
import router from "@/router";

const added = () => {
  router.push("/");
};
</script>
<template>
  <h1>{{ $t("Add a payment method") }}</h1>
  <CardElement :title="$t('Payment methods')">
    <AddPaymentMethod @added="added" />
  </CardElement>
</template>
