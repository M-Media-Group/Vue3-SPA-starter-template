<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import LoginOrRegister from "@/forms/LoginOrRegister.vue";
</script>

<template>
  <CardElement title="Connect">
    <template #header>
      <h1>Scan & Paddle</h1>
      <p>
        Scan & Paddle is a web application that allows you to scan your receipts
        and keep track of your expenses.
      </p>
    </template>
    <LoginOrRegister />
    <template #footer>
      <p>
        Scan & Paddle is a web application that allows you to scan your receipts
        and keep track of your expenses.
      </p>
    </template>
  </CardElement>
</template>
