<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import BaseForm from "@/forms/BaseForm.vue";
import { ref } from "vue";

const emailSent = ref(false);

const resendEmail = async () => {
  // Check if the email is already in use
  const response = await fetch("/email/verification-notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: null,
    }),
  });

  if (response.ok) {
    emailSent.value = true;
  } else {
    alert("Something went wrong sending you a new email. Please try again");
  }
};
</script>
<template>
  <h1>Confirm your email</h1>
  <CardElement class="card" title="Please confirm your email">
    <p>
      Please confirm your email address to continue. Check your spam too. If you
      didn't get an email, you can ask us to send you a new one.
    </p>
    <p class="success" v-if="emailSent">A new email has been sent to you.</p>
    <BaseForm
      v-else
      submit-text="Resend email"
      @submit="resendEmail"
    ></BaseForm>
  </CardElement>
</template>
