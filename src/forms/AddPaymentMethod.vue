<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { nextTick, onBeforeMount, reactive, ref } from "vue";
import BaseForm from "./BaseForm.vue";
import { loadStripe } from "@stripe/stripe-js";
import { StripeElements, StripeElement } from "vue-stripe-js";
import axios from "axios";

// Email, password, and remember me
const email = ref("");

const success = ref(false);

const baseForm = ref();

const userStore = useUserStore();

const form = reactive({
  paymentMethod: "",
  error: "",
  processing: false,
});

const emit = defineEmits(["added"]);

// The submit function. If there is just the email, check if the email is valid. If it is not, set the register mode. If it is, set the login mode.
const submitForm = async () => {
  const response = await userStore.sendPasswordResetEmail(email.value);
  if (response === true) {
    success.value = response;
  } else if (typeof response === "object") {
    console.log("Obj", response);
    baseForm.value.setInputErrors(response.data.errors);
  }
  return success.value;
};

const stripeLoaded = ref(false);
const elms = ref();
const card = ref();

const stripeKey = import.meta.env.VITE_STRIPE_KEY;

onBeforeMount(() => {
  const stripePromise = loadStripe(stripeKey);
  stripePromise.then(() => {
    stripeLoaded.value = true;
  });
});

const addPaymentMethod = () => {
  // Access instance methods, e.g. createToken()
  // Get stripe element
  const cardElement = card.value.stripeElement;

  elms.value.instance
    .createPaymentMethod({
      type: "card",
      card: cardElement,
    })
    .then((result: { error: { message: any }; paymentMethod: { id: any } }) => {
      // Handle result.error or result.token
      console.log(result);
      if (result.error) {
        form.error = result.error.message;
      } else {
        form.processing = true;
        axios
          .post(route("api.v1.paymentMethods.store"), {
            payment_method: result.paymentMethod.id,
          })
          .then((response) => {
            form.processing = false;
            // If the gtag function is available, log the event.
            // if (typeof gtag === "function") {
            // gtag("event", "add_payment_info");
            // fbq("track", "AddPaymentInfo");
            // }
            // closeModal();
            nextTick().then(() => emit("added"));
          })
          .catch((error) => {
            form.error = error.response.data.message;
          });
      }
      form.processing = false;
    });
};
</script>

<template>
  <BaseForm
    ref="baseForm"
    @submit="addPaymentMethod"
    :disabled="success || !stripeLoaded"
    :is-loading="form.processing"
  >
    <StripeElements
      v-if="stripeLoaded"
      v-slot="{ elements }"
      ref="elms"
      :stripe-key="stripeKey"
      :elements-options="{
        locale: $i18n.locale,
        fonts: [
          {
            cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
          },
        ],
      }"
    >
      <StripeElement
        ref="card"
        :elements="elements"
        :options="{
          style: {
            base: {
              iconColor: '#c4f0ff',
              color: '#fff',
              fontWeight: '500',
              fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
              fontSize: '16px',
              fontSmoothing: 'antialiased',
              ':-webkit-autofill': {
                color: '#fce883',
              },
              '::placeholder': {
                color: '#87BBFD',
              },
            },
            invalid: {
              iconColor: '#FFC7EE',
              color: '#FFC7EE',
            },
          },
        }"
      />
    </StripeElements>
  </BaseForm>
</template>
