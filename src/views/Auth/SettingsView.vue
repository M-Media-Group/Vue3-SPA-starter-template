<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import AccountSettings from "@/forms/AccountSettings.vue";
import AddPaymentMethod from "@/forms/AddPaymentMethod.vue";
import PersonalAccessTokens from "@/forms/PersonalAccessTokens.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import type { PersonalAccessToken } from "@/types/user";
import { ref } from "vue";

const userStore = useUserStore();

const handleUpdate = (event: { email: string | undefined }) => {
  // If the email is in the event, redirect to the confirm email page
  if (event.email) {
    router.push({ name: "confirm-email" });
  }
};

const addingNewPaymentMethod = ref(false);

const accessTokens = ref<PersonalAccessToken[]>([]);

userStore
  .getPersonalAccessTokens()
  .then((tokens) => (accessTokens.value = tokens));

const handleCreatedToken = (e: PersonalAccessToken) => {
  accessTokens.value.push(e);
};

const handleDeleteToken = (id: string) => {
  userStore.deletePersonalAccessToken(id);
  const accessTokenIndex = accessTokens.value.findIndex((token) => {
    return token.id === id;
  });
  accessTokens.value.splice(accessTokenIndex);
};
</script>
<template>
  <h1>{{ $t("My Account") }}</h1>
  <CardElement :title="$t('Settings')">
    <AccountSettings @updated="handleUpdate"></AccountSettings>
  </CardElement>
  <CardElement :title="$t('Payment methods')">
    <div v-if="userStore.user?.pm_type">
      <p>
        {{ $t("Default payment method") }}:
        {{ userStore.user.pm_type.toUpperCase() }} ****
        {{ userStore.user.pm_last_four }}
      </p>
    </div>
    <div v-else>
      <p>{{ $t("You do not have a default payment method set") }}</p>
    </div>
    <AddPaymentMethod
      v-if="addingNewPaymentMethod"
      @success="
        addingNewPaymentMethod = false;
        userStore.getUser();
      "
    />
    <button
      data-cy="add-payment-button"
      v-else
      @click="addingNewPaymentMethod = true"
    >
      {{ $t("Add a payment method") }}
    </button>
  </CardElement>
  <CardElement title="API">
    <template v-if="accessTokens.length > 0">
      <ul>
        <li v-for="token in accessTokens" :key="'token-' + token.id">
          <strong>{{ token.name ?? "Untitled token" }}: </strong>
          <span>created {{ token.created_at }}</span>
          <button @click="handleDeleteToken(token.id)">Delete</button>
        </li>
      </ul>
    </template>
    <p v-else>{{ $t("You have no API access tokens.") }}</p>
    <PersonalAccessTokens @created="handleCreatedToken" />
  </CardElement>
</template>
