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
    <confirms-gate
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
      <base-button>Force unconfirmed email</base-button>

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
        <base-button @click="attemptOk(success, fail, false)">Fail</base-button>
        <base-button @click="attemptOk(success, fail, true)">Ok</base-button>
      </template>
    </confirms-gate>

    <confirms-gate
      :title="$t('Connect')"
      :gate="['auth', 'confirmedPassword', 'hasPaymentMethod']"
      @confirmed="handleAuthenticated"
    >
      <base-button
        >Do action when authed, confirmedPassword, and
        hasPaymentMethod</base-button
      >
    </confirms-gate>

    <confirms-payment-method @confirmed="handlePaymentOk">
      <template v-slot="{ isConfirming }">
        <base-button :aria-busy="isConfirming"
          >Do action when payment method confirmed
        </base-button>
      </template>
    </confirms-payment-method>

    <confirms-gate
      :title="$t('Confirm your password')"
      gate="auth"
      @confirmed="handleAuthenticated"
    >
      <base-button>Do action when password confirmed</base-button>
    </confirms-gate>

    <!-- Nesting these modals doesnt "really" work -->
    <!-- <ConfirmsAuthenticated @confirmed="handleAuthenticated">
    <confirms-payment-method @confirmed="handlePaymentOk">
      <base-button>
        Do action when payment method confirmed and authed</base-button
      >
    </confirms-payment-method>
  </ConfirmsAuthenticated> -->
  </section>
</template>
