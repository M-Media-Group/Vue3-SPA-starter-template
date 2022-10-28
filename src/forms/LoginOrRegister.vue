<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { nextTick, ref } from "vue";
import BaseForm from "./BaseForm.vue";

const userStore = useUserStore();

// Email, password, and remember me
const email = ref("");
const password = ref("");
const rememberMe = ref(false);

// Name, Surname
const name = ref("");
const surname = ref("");

const checkedEmail = ref(false);

// Is the user registering or logging in?
const isRegistering = ref(false);

// The error message
const errorMessage = ref("");

const baseForm = ref();

// The check email function
const checkEmail = async () => {
  // Check if the email is already in use
  const response = await userStore.checkEmail(email.value);
  isRegistering.value = !response;

  errorMessage.value = "";
  checkedEmail.value = true;
};

// The login function
const login = async () => {
  // Check if the email is already in use
  const response = await userStore.login(email.value, password.value);

  if (response === false) {
    baseForm.value.setInputErrors({
      password: "Invalid email or password",
    });
    // const data = await response.json();
    // handleError(data.errors);
    password.value = "";
  }
};

// The register function
const register = async () => {
  // Check if the email is already in use
  const response = await userStore.register(
    email.value,
    password.value,
    name.value,
    surname.value
  );

  // const data = await response.json();

  if (response !== true) {
    // If the response has a body with json
    if (response.data) {
      const data = await response.data;

      // If in the data there is errors.email, return to the first screen by setting checkedEmail to false
      if (data.errors.email) {
        checkedEmail.value = false;
      }
      await nextTick();
      baseForm.value.setInputErrors(data.errors);
    } else {
      checkedEmail.value = false;
      await nextTick();

      baseForm.value.setInputErrors({
        email: "Something went wrong",
      });
    }
    // handleError(data.errors);
  } else {
    errorMessage.value = "";
    // Redirect to the dashboard
    router.push("/");
  }
};

// The submit function. If there is just the email, check if the email is valid. If it is not, set the register mode. If it is, set the login mode.
const submitForm = async () => {
  if (email.value && !checkedEmail.value) {
    await checkEmail();
    baseForm.value.focusOnFirstInput();
  } else if (isRegistering.value) {
    await register();
  } else {
    await login();
  }
};

const goBack = async () => {
  checkedEmail.value = false;
  await nextTick();
  baseForm.value.focusOnFirstInput();
};
</script>

<template>
  <BaseForm ref="baseForm" @submit="submitForm">
    <!-- The form starts with just the email. The user presses a button and we check if we should show the register or login inputs -->
    <!-- <TransitionGroup> -->
    <fieldset v-if="!checkedEmail">
      <label for="email">Email address</label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Email address"
        v-model="email"
        pattern="[^@]+@[^@]+\.[^@]+"
        autofocus
        required
      />
      <small>We'll never share your email with anyone else.</small>
    </fieldset>
    <fieldset v-else-if="isRegistering">
      <!-- Name, Surname, and new password inputs NOTE THE PATTERN - needed to trigger validity on non-dirty (script added) inputs, see https://stackoverflow.com/a/53261163/7410951 -->
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Name"
        v-model="name"
        minlength="2"
        pattern=".{2,}"
        title="Please enter Alphabets."
        autofocus
        required
      />
      <label for="surname">Surname</label>
      <input
        type="text"
        id="surname"
        name="surname"
        placeholder="Surname"
        v-model="surname"
        minlength="2"
        pattern=".{2,}"
        required
      />
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
        v-model="password"
        minlength="5"
        pattern=".{5,}"
        required
      />
    </fieldset>
    <fieldset v-else>
      <!-- Password input -->
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
        v-model="password"
        minlength="1"
        pattern=".{1,}"
        autofocus
        required
      />
      <!-- Forgot password link -->
      <RouterLink to="/forgot-password">Forgot password?</RouterLink>
    </fieldset>
    <template v-if="checkedEmail">
      <!-- Show a back button -->
      <BaseButton class="secondary" data-cy="back" @click="goBack()">
        Back
      </BaseButton>
    </template>
    <!-- </TransitionGroup> -->
  </BaseForm>
</template>
