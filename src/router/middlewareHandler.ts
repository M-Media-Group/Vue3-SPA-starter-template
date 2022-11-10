/** This file defines a middleware handler that can handle multiple middlewares in a given route, navigating to each one until all pass */
//     // if so, continue to the intended route

import type { RouteLocationNormalized } from "vue-router";

/**
 * A class that handles the middlewares of the coming request.
 *
 * @export
 * @class MiddlewareHandler
 */
export class MiddlewareHandler {
  /**
   * Our "request" object - the route that the request is going to
   *
   * @type {RouteLocationNormalized}
   * @memberof MiddlewareHandler
   */
  to: RouteLocationNormalized;

  constructor(to: RouteLocationNormalized) {
    this.to = to;
  }

  /**
   * All the middlewares for the coming request
   *
   * @readonly
   * @memberof MiddlewareHandler
   */
  get middlewares() {
    return this.to.meta.middleware as string[] | undefined;
  }

  /**
   * Handle a middleware given its name. It will import the middleware and then run its default export function
   *
   * @param {string} name
   * @return {*}
   * @memberof MiddlewareHandler
   */
  handleMiddleware(name: string) {
    return import(`./middlewares/${name}.ts`).then((middleware) => {
      return middleware.default(this.to);
    });
  }

  /**
   * Run the middleware handler. This will look at all the middlewares for the given route, and run them one by one. If a middleware redirects (e.g. prevents access), then the user will be redirected according to the middleware and the next middlewares will not run
   *
   * @return {*}
   * @memberof MiddlewareHandler
   */
  async handle() {
    if (!this.to.redirectedFrom && this.to.query.redirect) {
      return this.to.query.redirect;
    }

    // If there are no middlewares to run, just continue
    if (!this.middlewares) {
      return;
    }

    for (const middleware of this.middlewares) {
      const result = await this.handleMiddleware(middleware);

      // If the middleware returned something, it means that we're going to the middleware intercepted route instead
      if (result !== undefined) {
        // If the result is false, we cancel the navigation
        if (result === false) {
          return result;
        }

        // We should set a reference to the intended page in the URL so we can redirect there after the middleware that intercepted the request is satisfied. Some middlewares may not want this behaviour (e.g. if you're authenticated but trying to visit a guest only page (like login), you don't want to set a redirect to login in the URL as it makes no sense)
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
