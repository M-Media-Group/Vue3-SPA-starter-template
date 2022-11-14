<script setup lang="ts">
import BaseButton from "./BaseButton.vue";
import ConfirmsPaymentMethod from "./modals/ConfirmsPaymentMethod.vue";
import ConfirmsGate from "./modals/ConfirmsGate.vue";

const handleAuthenticated = () => {
  // Redirect to the home page
  alert("action here");
};

const handlePaymentOk = () => {
  alert("action here on ok payment");
};

const attemptOk = (success: () => any, fail: () => any, shouldPass: any) => {
  return shouldPass ? success() : fail();
};
</script>

<template>
  <section>
    <h1>Home</h1>
    <ConfirmsGate
      :title="$t('Confirm your email')"
      :gate="[
        {
          name: 'auth',
          options: {
            shouldPass: true,
          },
        },
        'hasGivenCameraPermission',
      ]"
      @confirmed="handleAuthenticated"
    >
      <BaseButton>Force unconfirmed email</BaseButton>

      <template
        #confirmationElement:hasGivenCameraPermission="{ success, fail }"
      >
        <p>
          {{
            $t(
              "Please confirm your email address to continue. Check your spam too. If you didn't get an email, you can ask us to send you a new one."
            )
          }}
        </p>
        <BaseButton @click="attemptOk(success, fail, false)">Fail</BaseButton>
        <BaseButton @click="attemptOk(success, fail, true)">Ok</BaseButton>
      </template>
    </ConfirmsGate>

    <ConfirmsGate
      :title="$t('Connect')"
      :gate="['auth', 'confirmedPassword', 'hasPaymentMethod']"
      @confirmed="handleAuthenticated"
    >
      <BaseButton
        >Do action when authed, confirmedPassword, and
        hasPaymentMethod</BaseButton
      >
    </ConfirmsGate>

    <ConfirmsPaymentMethod @confirmed="handlePaymentOk">
      <template v-slot="{ isConfirming }">
        <BaseButton :aria-busy="isConfirming"
          >Do action when payment method confirmed
        </BaseButton>
      </template>
    </ConfirmsPaymentMethod>

    <ConfirmsGate
      :title="$t('Confirm your password')"
      gate="auth"
      @confirmed="handleAuthenticated"
    >
      <BaseButton>Do action when password confirmed</BaseButton>
    </ConfirmsGate>

    <!-- Nesting these modals doesnt "really" work -->
    <!-- <ConfirmsAuthenticated @confirmed="handleAuthenticated">
    <ConfirmsPaymentMethod @confirmed="handlePaymentOk">
      <BaseButton>
        Do action when payment method confirmed and authed</BaseButton
      >
    </ConfirmsPaymentMethod>
  </ConfirmsAuthenticated> -->
  </section>
</template>
