import { useUserStore } from "@/stores/user";
import type { RouteLocationRaw } from "vue-router";
import { baseGate } from "@m-media/vue3-gate-keeper";

/** A middleware that checks if the user is authenticated */
export default class extends baseGate {
  form = "AddPaymentMethod";

  async handle() {
    const store = useUserStore();
    // check if the user has a payment method
    const hasPaymentMethod = store.user?.pm_type && store.user?.stripe_id;
    // if not, redirect to the add payment method page
    if (!hasPaymentMethod) {
      return this.fail();
    }
  }

  route(): false | RouteLocationRaw {
    return {
      name: "add-payment-method",
    };
  }
}
