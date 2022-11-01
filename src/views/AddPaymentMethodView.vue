<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import AddPaymentMethod from "@/forms/AddPaymentMethod.vue";
</script>
<template>
  <h1>{{ $t("Add a payment method") }}</h1>
  <CardElement :title="$t('Payment methods')">
    <AddPaymentMethod />
  </CardElement>
</template>
