import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import AboutViewVue from "../views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Auth/LoginOrRegisterView.vue"),
      meta: {
        middleware: ["guest", "dontRedirect"],
      },
    },
    // A logout route that just calls the logout on userStore, then redirects to login
    {
      path: "/logout",
      name: "logout",
      beforeEnter: async (to, from, next) => {
        const store = useUserStore();
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
        await store.logout();
        return next({ name: "login" });
      },
      component: () => import("../views/Auth/LoginOrRegisterView.vue"),
      meta: {
        middleware: ["auth", "dontRedirect"],
      },
    },

    {
      path: "/sign-up",
      name: "sign-up",
      component: () => import("../views/Auth/LoginOrRegisterView.vue"),
      meta: {
        middleware: ["guest", "dontRedirect"],
      },
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("../forms/ResetPassword.vue"),
      meta: {
        middleware: ["guest"],
      },
    },
    {
      path: "/confirm-email",
      name: "confirm-email",
      component: () => import("../views/Auth/ConfirmEmailView.vue"),
      meta: {
        middleware: ["auth", "unconfirmedEmail", "dontRedirect"],
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/Auth/SettingsView.vue"),
      meta: {
        middleware: ["auth"],
      },
    },
    {
      path: "/add-payment-method",
      name: "add-payment-method",
      component: () => import("../views/AddPaymentMethodView.vue"),
      meta: {
        middleware: ["auth", "dontRedirect"],
      },
    },
    {
      path: "/rent",
      name: "rent",
      component: AboutViewVue,
      meta: {
        middleware: ["auth", "confirmedEmail", "hasPaymentMethod"],
      },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

router.beforeEach(async (to, from) => {
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
    from.redirectedFrom.name !== "logout"
  ) {
    return {
      name: from.redirectedFrom.name,
      query: from.redirectedFrom.query,
    };
  }
});

export default router;
