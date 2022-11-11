<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { nextTick, onBeforeMount, reactive, ref } from "vue";
import BaseForm from "./BaseForm.vue";
import { loadStripe } from "@stripe/stripe-js";
import { StripeElement, StripeElements } from "vue-stripe-js";
import { getCssVarForStripe } from "@/helpers/cssVariables";

const success = ref(false);

const elementReady = ref(false);

const paymentInfoComplete = ref(false);

const baseForm = ref();

const userStore = useUserStore();

const form = reactive({
  paymentMethod: "",
  error: "",
  processing: false,
});

const emit = defineEmits(["success"]);

const handleStripeInput = async (event: { complete: any }) => {
  paymentInfoComplete.value = !!event.complete;
  if (paymentInfoComplete.value === true) {
    // Scroll to bottom
    // Wait for next tick
    nextTick(() => {
      // Focus on the submit button in the baseForm
    });
  }
};

const stripeLoaded = ref(false);
const elms = ref();
const card = ref();

const clientSecret = ref();

const stripeKey = import.meta.env.VITE_STRIPE_KEY;

onBeforeMount(() => {
  getClientSecret();
  const stripePromise = loadStripe(stripeKey);
  stripePromise.then(() => {
    stripeLoaded.value = true;
  });
});

const getClientSecret = async () => {
  const response = await userStore.getPaymentIntent();
  if (response) {
    clientSecret.value = response.client_secret;
  }
};

const addPaymentMethod = async () => {
  form.processing = true;
  // Access instance methods, e.g. createToken()
  // Get stripe element
  const cardElement = card.value.stripeElement;

  elms.value.instance
    .confirmCardSetup(clientSecret.value, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: userStore.user?.name + " " + userStore.user?.surname,
          email: userStore.user?.email,
        },
      },
    })
    .then(
      (result: {
        error: { message: string };
        setupIntent: { payment_method: string };
      }) => {
        // Handle result.error or result.token
        if (result.error) {
          form.error = result.error.message;
          alert(form.error);
          form.processing = false;
        } else {
          if (!userStore.isAuthenticated) {
            return;
          }
          userStore
            .addPaymentMethod(result.setupIntent.payment_method)
            .then((response) => {
              // If the response is false, pass to the next catch
              if (!response) {
                throw new Error("Error adding payment method");
              }
              emit("success");
              form.processing = false;
            })
            .catch((error) => {
              form.error = error.response.data.message;
              form.processing = false;
            });
        }
      }
    );
};

const appearanceVariables = {
  colorPrimary: getCssVarForStripe("primary"),
  colorBackground: getCssVarForStripe("form-element-background-color"),
  colorText: getCssVarForStripe("form-element-color"),
  colorDanger: getCssVarForStripe("form-element-invalid-border-color"),
  fontFamily: "system-ui,-apple-system,Roboto, Open Sans, Segoe UI, sans-serif",
  // spacingUnit: '2px',
  fontSizeBase: getCssVarForStripe("font-size"),
  borderRadius: getCssVarForStripe("border-radius"),
  // See all possible variables below
};

const elementStyle = {
  base: {
    iconColor: getCssVarForStripe("form-element-color"),
    color: getCssVarForStripe("form-element-color"),
    fontWeight: getCssVarForStripe("font-weight"),
    fontFamily:
      "system-ui,-apple-system,Roboto, Open Sans, Segoe UI, sans-serif",
    fontSize: getCssVarForStripe("font-size"),
    // Even though lineHeight is not suggested to be used by Stripe, we need it to keep a consistent look with Pico
    lineHeight: getCssVarForStripe("line-height"),
    fontSmoothing: "antialiased",
    // ':-webkit-autofill': {
    //   color: '#fce883',
    // },
    "::placeholder": {
      color: getCssVarForStripe("form-element-placeholder-color"),
    },
  },
  invalid: {
    iconColor: getCssVarForStripe("form-element-invalid-border-color"),
    color: getCssVarForStripe("form-element-invalid-border-color"),
  },
};

// The function receives event: { elementType: string } as a parameter - if we need it
const handleElementReady = async () => {
  elementReady.value = true;

  // Focus on the card
  await nextTick();
  focusOnInput();
};

const focusOnInput = () => {
  card.value.stripeElement.focus();
};
</script>

<template>
  <BaseForm
    v-if="userStore.isAuthenticated"
    ref="baseForm"
    @submit="addPaymentMethod"
    :disabled="
      success ||
      !stripeLoaded ||
      !elementReady ||
      !paymentInfoComplete ||
      !clientSecret
    "
    :is-loading="form.processing || !stripeLoaded"
    data-cy="add-payment-form"
  >
    <label @click="focusOnInput()">{{ $t("Add a payment method") }}</label>
    <StripeElements
      @click="focusOnInput()"
      class="input"
      style="min-width: 280px"
      v-if="stripeLoaded"
      v-slot="{ elements }"
      ref="elms"
      :stripe-key="stripeKey"
      :aria-busy="!elementReady"
      data-cy="add-payment-input"
      :elements-options="{
        locale: $i18n.locale,
        appearance: {
          variables: appearanceVariables,
        },
      }"
    >
      <StripeElement
        v-show="elementReady"
        ref="card"
        :elements="elements"
        @change="handleStripeInput($event)"
        @ready="handleElementReady"
        :options="{
          style: elementStyle,
        }"
      />
    </StripeElements>
  </BaseForm>
  <div v-else>{{ $t("Login or sign up to continue") }}</div>
</template>
