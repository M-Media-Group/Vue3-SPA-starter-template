/** This file defines a middleware handler that can handle multiple middlewares in a given route, navigating to each one until all pass */
//     // if so, continue to the intended route

import type { RouteLocationNormalized } from "vue-router";

export class MiddlewareHandler {
  to: RouteLocationNormalized;

  constructor(to: RouteLocationNormalized) {
    this.to = to;
  }

  get middlewares() {
    return this.to.meta.middleware as string[] | undefined;
  }

  handleMiddleware(name: string) {
    return import(`./middlewares/${name}`).then((middleware) => {
      return middleware.default(this.to);
    });
  }

  async handle() {
    if (!this.to.redirectedFrom && this.to.query.redirect) {
      return this.to.query.redirect;
    }
    console.log(this.to);
    if (!this.middlewares) {
      return;
    }

    for (const middleware of this.middlewares) {
      const result = await this.handleMiddleware(middleware);
      if (result) {
        if (!(result.setRedirectToIntended === false)) {
          result.query = {
            redirect: this.to.fullPath,
          };
        }
        return result;
      }
    }
  }
}

// export default new MiddlewareHandler();
