<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseForm from "@/forms/BaseForm.vue";

import { useUserStore } from "@/stores/user";
import { nextTick, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();

const { t } = useI18n();

/**
 * Note that we don't have the email here. Its in the userStore - we put it there so we can remember the email entered across the login, forgot password, and register pages.
 */
const authForm = reactive({
  name: "",
  surname: "",
  password: "",
});

const checkedEmail = ref(false);

// Is the user registering or logging in?
const isRegistering = ref(false);

// The error message
const errorMessage = ref("");

const baseFormRef = ref();

const emit = defineEmits(["success"]);

// The check email function
const checkEmail = async () => {
  if (!userStore.userEmail) {
    return;
  }
  // Check if the email is already in use
  const response = await userStore.checkEmail(userStore.userEmail);

  // If the response is not a bool
  if (typeof response !== "boolean") {
    alert(response.data.message);
    return;
  }
  isRegistering.value = !response;

  errorMessage.value = "";
  checkedEmail.value = true;
};

// The login function
const login = async () => {
  if (!userStore.userEmail) {
    return;
  }
  // Check if the email is already in use
  const response = await userStore.login(
    userStore.userEmail,
    authForm.password
  );

  if (response === false) {
    baseFormRef.value.setInputErrors({
      password: t("Invalid email or password"),
    });
    // const data = await response.json();
    // handleError(data.errors);
    authForm.password = "";
  } else {
    emit("success");
  }
};

// The register function
const register = async () => {
  if (!userStore.userEmail) {
    return;
  }
  // Check if the email is already in use
  const response = await userStore.register(
    userStore.userEmail,
    authForm.password,
    authForm.name,
    authForm.surname
  );

  // const data = await response.json();

  if (response !== true) {
    // If the response has a body with json
    if (response.data) {
      const data = await response.data;
      // If there are no errors, we need to throw a generic error
      if (!data.errors) {
        checkedEmail.value = false;
        await nextTick();
        alert("Something went wrong on our side, please try again");
        return;
      }

      // If in the data there is errors.email, return to the first screen by setting checkedEmail to false
      if (data.errors?.email) {
        checkedEmail.value = false;
      }
      await nextTick();
      baseFormRef.value.setInputErrors(data.errors);
    } else {
      checkedEmail.value = false;
      await nextTick();

      baseFormRef.value.setInputErrors({
        email: "Something went wrong",
      });
    }
    // handleError(data.errors);
  } else {
    emit("success");
  }
};

// The submit function. If there is just the email, check if the email is valid. If it is not, set the register mode. If it is, set the login mode.
const submitForm = async () => {
  if (userStore.userEmail && !checkedEmail.value) {
    await checkEmail();
    baseFormRef.value.focusOnFirstInput();
  } else if (isRegistering.value) {
    await register();
  } else {
    await login();
  }
};

const goBack = async () => {
  checkedEmail.value = false;
  await nextTick();
  baseFormRef.value.focusOnFirstInput();
};
</script>

<template>
  <base-form
    ref="baseFormRef"
    @submit="submitForm"
    :isLoading="userStore.isLoading"
  >
    <!-- The form starts with just the email. The user presses a button and we check if we should show the register or login inputs -->
    <!-- <TransitionGroup> -->
    <fieldset v-if="!checkedEmail">
      <label for="email">{{ $t("Email") }}</label>
      <input
        type="email"
        id="email"
        name="email"
        :placeholder="$t('Email')"
        v-model="userStore.userEmail"
        pattern="[^@]+@[^@]+\.[^@]+"
        autofocus
        required
      />
      <small>{{ $t("We'll never share your email with anyone else.") }}</small>
    </fieldset>
    <fieldset v-else-if="isRegistering">
      <!-- Name, Surname, and new password inputs NOTE THE PATTERN - needed to trigger validity on non-dirty (script added) inputs, see https://stackoverflow.com/a/53261163/7410951 -->
      <label for="name">{{ $t("Name") }}</label>
      <input
        type="text"
        id="name"
        name="name"
        :placeholder="$t('Name')"
        v-model="authForm.name"
        minlength="2"
        pattern=".{2,}"
        autocomplete="given-name"
        autofocus
        required
      />
      <label for="surname">{{ $t("Surname") }}</label>
      <input
        type="text"
        id="surname"
        name="surname"
        :placeholder="$t('Surname')"
        v-model="authForm.surname"
        minlength="2"
        pattern=".{2,}"
        autocomplete="family-name"
        required
      />
      <label for="password">{{ $t("Password") }}</label>
      <input
        type="password"
        id="password"
        name="password"
        :placeholder="$t('Password')"
        v-model="authForm.password"
        minlength="5"
        pattern=".{5,}"
        autocomplete="new-password"
        required
      />

      <!-- An accept TOC checkbox -->
      <label>
        <input type="checkbox" id="acceptToc" name="acceptToc" required />
        {{ $t("I accept the") }}
        <a href="/terms-of-service" target="_blank">
          {{ $t("Terms of Service") }}
        </a>
        {{ $t("and") }}
        <a href="/privacy-policy" target="_blank">
          {{ $t("Privacy Policy") }}
        </a>
      </label>
    </fieldset>
    <fieldset v-else>
      <!-- Password input -->
      <label for="password">{{ $t("Password") }}</label>
      <input
        type="password"
        id="password"
        name="password"
        :placeholder="$t('Password')"
        v-model="authForm.password"
        minlength="1"
        pattern=".{1,}"
        autocomplete="current-password"
        autofocus
        required
      />
      <!-- Forgot password link -->
      <router-link to="/forgot-password">{{
        $t("Forgot password?")
      }}</router-link>
    </fieldset>
    <template v-if="checkedEmail" #after-submit>
      <!-- Show a back button -->
      <base-button class="secondary" data-cy="back" @click="goBack()">
        {{ $t("Go back") }}
      </base-button>
    </template>
    <!-- </TransitionGroup> -->
  </base-form>
</template>
