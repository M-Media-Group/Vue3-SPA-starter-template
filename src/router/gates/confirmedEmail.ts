import { useUserStore } from "@/stores/user";
import type { RouteLocationRaw } from "vue-router";
import { baseGate } from "@m-media/vue3-gate-keeper";

/** A middleware that checks if the user is authenticated */
export default class extends baseGate {
  async handle() {
    const store = useUserStore();
    const shouldVerifyEmail = !store.user?.email_verified_at;
    if (shouldVerifyEmail) {
      return this.fail();
    }
  }

  route(): false | RouteLocationRaw {
    return {
      name: "confirm-email",
    };
  }
}
