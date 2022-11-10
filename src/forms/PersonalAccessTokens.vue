<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseForm from "./BaseForm.vue";

const userStore = useUserStore();

const { t } = useI18n();

// Email, password, and remember me
const tokenName = ref("");

const baseForm = ref();

const emit = defineEmits(["created"]);

// The submit function. If there is just the email, check if the email is valid. If it is not, set the register mode. If it is, set the login mode.
const submitForm = async () => {
  if (!tokenName.value) {
    return;
  }

  const response = await userStore.createPersonalAccessToken(tokenName.value);

  if (response) {
    emit("created", response);
    const text = t(
      "Your personal access token has been created. This is the only time you can see it."
    );
    alert(text + "\n\n" + response.token);
  } else if (typeof response === "object") {
    // We want to show the user the correct fields to the user so they feel better
    baseForm.value.setSuccessOnInputs();
    // Show the fields with errors
    baseForm.value.setInputErrors(response.data.errors);
  }
};
</script>

<template>
  <BaseForm
    ref="baseForm"
    @submit="submitForm"
    :isLoading="userStore.isLoading"
    submitText="Create a new API token"
  >
    <label for="name">{{ $t("New token name") }}</label>
    <input
      type="text"
      name="name"
      :placeholder="$t('Token name')"
      required
      v-model="tokenName"
    />
  </BaseForm>
</template>
