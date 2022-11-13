import { useUserStore } from "@/stores/user";
import { baseGate } from "@m-media/vue3-gate-keeper";

export default class extends baseGate {
  form = "ConfirmPassword";

  async handle() {
    const store = useUserStore();
    await store.isReady;
    if (store.isAuthenticated) {
      return {
        path: "/",
        setRedirectToIntended: false,
      };
    }
  }
}
