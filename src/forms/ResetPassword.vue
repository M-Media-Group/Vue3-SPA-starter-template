<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import router from "@/router";
import { nextTick, ref } from "vue";
import BaseForm from "./BaseForm.vue";

// Email, password, and remember me
const email = ref("");

const success = ref(false);

// The error message
const errorMessage = ref("");

const baseForm = ref();

// The submit function. If there is just the email, check if the email is valid. If it is not, set the register mode. If it is, set the login mode.
const submitForm = async () => {
  // Check if the email is valid
  if (!email.value) {
    errorMessage.value = "Please enter an email";
    return;
  }

  // Submit a reset password
  const response = await fetch("/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
    }),
  });
  success.value = response.ok;
};
</script>

<template>
  <BaseForm ref="baseForm" @submit="submitForm" :disabled="success">
    <label for="email">Email address</label>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="Email address"
      v-model="email"
      :disabled="success"
      autofocus
      required
    />
    <small v-if="success" class="success"
      >If the account exists an email has been sent!</small
    >
  </BaseForm>
</template>
