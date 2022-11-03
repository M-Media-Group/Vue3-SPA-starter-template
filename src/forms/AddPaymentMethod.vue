<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { nextTick, onBeforeMount, reactive, ref } from "vue";
import BaseForm from "./BaseForm.vue";
import { loadStripe } from "@stripe/stripe-js";
import { StripeElements, StripeElement } from "vue-stripe-js";
import axios from "axios";

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
  form.processing = true;
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
      if (result.error) {
        form.error = result.error.message;
      } else {
        if (!userStore.user?.id) {
          return;
        }
        axios
          .post("/api/users/" + userStore.user.id + "/payment-methods", {
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

const hsl2rgb = (h: number, s: number, l: number) => {
  let a = s * Math.min(l, 1 - l);
  let f = (n: number, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [f(0), f(8), f(4)];
};

const getCssVarForStripe = (color: string) => {
  const computedColor = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${color}`)
    .trim()
    .replace("deg", "");

  // If the computedColor starts with hsl, convert it to rgb
  if (computedColor.startsWith("hsl")) {
    const hsl = computedColor.replace("hsl(", "").replace(")", "").split(",");
    const rgb = hsl2rgb(
      parseInt(hsl[0]),
      parseInt(hsl[1]) / 100,
      parseInt(hsl[2]) / 100
    );
    const rgbIn255Scale = rgb.map((c) => Math.round(c * 255));
    return `rgb(${rgbIn255Scale.join(",")})`;
  }

  return computedColor;
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
    <label>{{ $t("Add a payment method") }}</label>
    <StripeElements
      class="input"
      v-if="stripeLoaded"
      v-slot="{ elements }"
      ref="elms"
      :stripe-key="stripeKey"
      :aria-busy="!elementReady"
      :elements-options="{
        locale: $i18n.locale,
        appearance: {
          variables: appearanceVariables,
        },
      }"
    >
      <StripeElement
        ref="card"
        :elements="elements"
        @change="handleStripeInput($event)"
        @ready="elementReady = $event"
        :options="{
          style: elementStyle,
        }"
      />
    </StripeElements>
  </BaseForm>
</template>
