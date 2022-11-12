import type { RouteLocationRaw } from "vue-router";
import type { MiddlewareOptions } from "../middlewareHandler";

/**
 * The base middleware abstract class, which all other middlewares should extend.
 *
 * @abstract
 * @class baseMiddleware
 */
abstract class baseMiddleware {
  options = {} as MiddlewareOptions;
  form = false as string | false;

  public setOptions(options: RouteLocationRaw | any) {
    this.options = options;
    return this;
  }

  fail() {
    if (
      this.options &&
      typeof this.options === "object" &&
      "routeData" in this.options &&
      this.options.routeData
    ) {
      return this.route();
    } else {
      return this.form;
    }
  }

  abstract handle(): Promise<RouteLocationRaw | false | string | undefined>;

  route(): RouteLocationRaw | false {
    if (this.form === false) {
      return this.form;
    }

    return {
      path: "/confirm/" + this.form,
    };
  }
}

export default baseMiddleware;
