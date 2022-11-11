import { useUserStore } from "@/stores/user";
import type { RouteLocationRaw } from "vue-router";
import baseMiddleware from "./baseMiddleware";

/** A middleware that checks if the user is authenticated */
class auth extends baseMiddleware {
  form = "LoginOrRegister";

  async handle() {
    const store = useUserStore();
    await store.isReady;
    if (!store.isAuthenticated) {
      return this.fail();
    }
  }

  route(): false | RouteLocationRaw {
    return {
      name: "login",
    };
  }
}

const middleware = new auth();

export default (options: any) => {
  return middleware.setOptions(options).handle();
};
