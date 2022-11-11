import type { RouteLocationRaw } from "vue-router";

abstract class baseMiddleware {
  options = {} as any;
  form = false as string | false;

  public setOptions(options: any) {
    this.options = options;
    return this;
  }

  fail() {
    if (
      this.options &&
      typeof this.options === "object" &&
      "name" in this.options
    ) {
      return this.route();
    } else {
      return this.form;
    }
  }

  abstract handle(): Promise<any>;

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
