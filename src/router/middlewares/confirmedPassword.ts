import { useUserStore } from "@/stores/user";
import { baseGate } from "@m-media/vue3-gate-keeper";

class confirmedPassword extends baseGate {
  form = "ConfirmPassword";

  async handle() {
    const store = useUserStore();
    await store.isReady;
    const shouldConfirmPassword = await store.shouldConfirmPassword();
    if (shouldConfirmPassword) {
      return this.fail();
    }
  }
}

const middleware = new confirmedPassword();

export default (options: any) => {
  return middleware.setOptions(options).handle();
};
