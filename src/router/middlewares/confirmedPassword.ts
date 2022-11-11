import { useUserStore } from "@/stores/user";
import baseMiddleware from "./baseMiddleware";

class confirmedPassword extends baseMiddleware {
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
