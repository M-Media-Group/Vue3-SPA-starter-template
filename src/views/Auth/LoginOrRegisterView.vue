<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import LoginOrRegister from "@/forms/LoginOrRegister.vue";
</script>

<template>
  <CardElement title="Connect">
    <template #header>
      <h1>Scan & Paddle</h1>
      <p>Find a board, scan the code, and paddle on!</p>
    </template>
    <LoginOrRegister />
  </CardElement>
</template>
