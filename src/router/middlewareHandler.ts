import { useUserStore } from "@/stores/user";
import type { RouteLocationNormalized } from "vue-router";

export const handleMiddleware = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => {
  // The the to.meta.middleware value so Typescript knows its format
  const middleware = to.meta.middleware as string[] | undefined;
  const store = useUserStore();

  const shouldRedirect = !(middleware && middleware.includes("dontRedirect"));
  if (
    middleware &&
    (middleware.includes("auth") ||
      middleware.includes("guest") ||
      middleware.includes("confirmedEmail") ||
      middleware.includes("unconfirmedEmail") ||
      middleware.includes("hasPaymentMethod"))
  ) {
    if (store.isLoading) {
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (!store.isLoading) {
            clearInterval(interval);
            resolve(true);
          }
        }, 10);
      });
    }
    if (!store.attemptedToFetchUser) {
      await store.getUser();
    }
  }

  // if the route has auth in its middleware array
  if (middleware && middleware.includes("auth")) {
    // if not, redirect to the login page
    if (!store.isAuthenticated) {
      return {
        name: "login",
        query: {
          redirect: to.fullPath,
        },
      };
    }
  } else if (middleware && middleware.includes("guest")) {
    // if so, redirect to the home page
    if (store.isAuthenticated) {
      return {
        name: "home",
      };
    }
  }
  if (middleware && middleware.includes("confirmedEmail")) {
    // check if the user has confirmed their email
    const hasConfirmedEmail = store.user?.email_verified_at !== null;
    // if not, redirect to the confirm email page
    if (!hasConfirmedEmail) {
      return {
        name: "confirm-email",
        query: {
          redirect: to.fullPath,
        },
      };
    }
  } else if (middleware && middleware.includes("unconfirmedEmail")) {
    // check if the user has confirmed their email
    const hasConfirmedEmail = store.user?.email_verified_at;
    // if so, redirect to the home page
    if (hasConfirmedEmail) {
      return {
        name: "home",
      };
    }
  }

  if (middleware && middleware.includes("hasPaymentMethod")) {
    // check if the user has a payment method
    const hasPaymentMethod = store.user?.pm_type && store.user?.stripe_id;
    // if not, redirect to the add payment method page
    if (!hasPaymentMethod) {
      return {
        name: "add-payment-method",
        query: {
          redirect: to.fullPath,
        },
      };
    }
  }
  // // Finally, if there is a redirect query param, redirect to that
  if (
    from.redirectedFrom &&
    shouldRedirect &&
    from.redirectedFrom.path !== to.path &&
    from.redirectedFrom.name &&
    from.redirectedFrom.name !== "logout"
  ) {
    return {
      name: from.redirectedFrom.name,
      query: from.redirectedFrom.query,
    };
  }
};
