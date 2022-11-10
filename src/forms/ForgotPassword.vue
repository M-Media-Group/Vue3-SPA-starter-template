<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import BaseForm from "./BaseForm.vue";

const success = ref(false);

const baseForm = ref();

const emit = defineEmits(["success"]);

const userStore = useUserStore();
// The submit function. If there is just the email, check if the email is valid. If it is not, set the register mode. If it is, set the login mode.
const submitForm = async () => {
  if (!userStore.userEmail) {
    return;
  }
  const response = await userStore.sendPasswordResetEmail(userStore.userEmail);
  if (response === true) {
    success.value = response;
    emit("success");
  } else if (typeof response === "object") {
    baseForm.value.setInputErrors(response.data.errors);
  }
  return success.value;
};
</script>

<template>
  <BaseForm
    ref="baseForm"
    @submit="submitForm"
    :disabled="success"
    :submit-text="$t('Send a new password')"
  >
    <label for="email">{{ $t("Email") }}</label>
    <input
      type="email"
      id="email"
      name="email"
      :placeholder="$t('Email')"
      v-model="userStore.userEmail"
      :disabled="success"
      autofocus
      required
    />
    <small v-if="success" class="success">{{
      $t("If the account exists an email has been sent!")
    }}</small>
  </BaseForm>
</template>
