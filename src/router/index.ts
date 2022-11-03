import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import AboutViewVue from "../views/AboutView.vue";
import { handleMiddleware } from "./middlewareHandler";
import { setMetaAttributes } from "./metaTagsHandler";

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
      component: () => import("../forms/ForgotPassword.vue"),
      meta: {
        middleware: ["guest"],
      },
    },
    {
      path: "/reset-password",
      name: "reset-password",
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
  setMetaAttributes(to, from);
  const middlewareResponse = await handleMiddleware(to, from);
  if (middlewareResponse !== null) {
    return middlewareResponse;
  }
});

export default router;
