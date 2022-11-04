<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import BaseForm from "./BaseForm.vue";

// Password, password, and remember me
const password = ref("");

const success = ref(false);

const baseForm = ref();

const token = router.currentRoute.value.query.token as string;
const email = router.currentRoute.value.query.email as string;

const userStore = useUserStore();
// The submit function. If there is just the password, check if the password is valid. If it is not, set the register mode. If it is, set the login mode.
const submitForm = async () => {
  const response = await userStore.sendPasswordReset(
    email,
    token,
    password.value
  );
  if (response === true) {
    success.value = response;
  } else if (typeof response === "object") {
    if (response.data.errors.email) {
      response.data.errors.password = response.data.errors.email;
      delete response.data.errors.email;
    }
    baseForm.value.setInputErrors(response.data.errors);
  }
  return success.value;
};
</script>

<template>
  <BaseForm ref="baseForm" @submit="submitForm" :disabled="success">
    <label for="password">{{ $t("New password") }}</label>
    <input
      type="password"
      name="password"
      :placeholder="$t('New password')"
      v-model="password"
      :disabled="success"
      autofocus
      autocomplete="new-password"
      required
    />
    <small v-if="success" class="success">{{
      $t("You can now log in with your new password!")
    }}</small>
  </BaseForm>
</template>
