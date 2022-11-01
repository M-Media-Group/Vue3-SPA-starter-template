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

const elementReady = ref(false);

const paymentInfoComplete = ref(false);

const baseForm = ref();

const userStore = useUserStore();

const form = reactive({
  paymentMethod: "",
  error: "",
  processing: false,
});

const emit = defineEmits(["added"]);

const handleStripeInput = async (event: any) => {
  paymentInfoComplete.value = !!event.complete;
  if (paymentInfoComplete.value === true) {
    // Scroll to bottom
    // Wait for next tick
    nextTick(() => {
      window.scrollTo(0, document.body.scrollHeight);
      // Focus on ref="payButton"
      // payButton.value.focus();
    });
  }
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
    :disabled="
      success || !stripeLoaded || !elementReady || !paymentInfoComplete
    "
    :is-loading="form.processing"
  >
    <StripeElements
      class="input"
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
        @change="handleStripeInput($event)"
        @ready="elementReady = $event"
        :options="{
          style: {
            base: {
              iconColor: '#c4f0ff',
              color: '#fff',
              fontWeight: '400',
              fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
              fontSize: '16px',
              lineHeight: '24px',
              fontSmoothing: 'antialiased',
              ':-webkit-autofill': {
                color: '#fce883',
              },
              '::placeholder': {
                color: '#73828C',
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
