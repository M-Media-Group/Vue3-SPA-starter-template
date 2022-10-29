<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { nextTick, ref } from "vue";
import BaseForm from "./BaseForm.vue";

const userStore = useUserStore();

// Email, password, and remember me
const email = ref(userStore.user?.email);
const password = ref("");
const rememberMe = ref(false);

// Name, Surname
const name = ref(userStore.user?.name);
const surname = ref(userStore.user?.surname);

const checkedEmail = ref(false);

// Is the user registering or logging in?
const isRegistering = ref(false);

// The error message
const errorMessage = ref("");

const baseForm = ref();

const emit = defineEmits(["authenticated"]);

// The submit function. If there is just the email, check if the email is valid. If it is not, set the register mode. If it is, set the login mode.
const submitForm = async () => {
  if (!email.value || !name.value || !surname.value) {
    return;
  }
  const response = await userStore.update(
    name.value,
    surname.value,
    email.value
  );

  if (response === true) {
    return;
  } else if (typeof response === "object") {
    console.log("Obj", response);
    baseForm.value.setInputErrors(response.data.errors);
  }
};
</script>

<template>
  <BaseForm
    ref="baseForm"
    @submit="submitForm"
    :isLoading="userStore.isLoading"
  >
    <!-- The form starts with just the email. The user presses a button and we check if we should show the register or login inputs -->
    <!-- <TransitionGroup> -->

    <!-- Name, Surname, and new password inputs NOTE THE PATTERN - needed to trigger validity on non-dirty (script added) inputs, see https://stackoverflow.com/a/53261163/7410951 -->
    <label for="name">{{ $t("Name") }}</label>
    <input
      type="text"
      id="name"
      name="name"
      :placeholder="$t('Name')"
      v-model="name"
      minlength="2"
      pattern=".{2,}"
      title="Please enter Alphabets."
      autofocus
      required
    />
    <label for="surname">{{ $t("Surname") }}</label>
    <input
      type="text"
      id="surname"
      name="surname"
      :placeholder="$t('Surname')"
      v-model="surname"
      minlength="2"
      pattern=".{2,}"
      required
    />
    <label for="email">{{ $t("Email") }}</label>
    <input
      type="email"
      id="email"
      name="email"
      :placeholder="$t('Email')"
      v-model="email"
      pattern="[^@]+@[^@]+\.[^@]+"
      autofocus
      required
    />
    <small>{{ $t("We'll never share your email with anyone else.") }}</small>
    <!-- </TransitionGroup> -->
  </BaseForm>
</template>
