import { createRouter, createWebHistory } from "vue-router";
import { setMetaAttributes } from "./metaTagsHandler";
import $bus, { eventTypes } from "@/eventBus/events";
import authRoutes from "./authRoutes";
import { MiddlewareHandler } from "./middlewareHandler";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: {
        // Notice how we pass the translation key rather than the actual string. This is because Vue Router will cache our meta, so if we just passed the translated string it would not update on language change.
        title: "Home",
      },
      component: () => import("../views/HomeView.vue"),
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
        middleware: ["auth"],
      },
    },
    {
      path: "/rent",
      name: "rent",
      component: () => import("../views/AboutView.vue"),
      meta: {
        middleware: [
          "auth",
          "confirmedEmail",
          "hasPaymentMethod",
          "confirmedPassword",
        ],
      },
    },
    {
      path: "/about",
      name: "about",
      meta: {
        middleware: ["auth", "confirmedPassword"],
      },
      component: () => import("../views/AboutView.vue"),
    },
  ].concat(authRoutes),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to) => {
  const store = useUserStore();
  if (store.isLoading || !store.attemptedToFetchUser) {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!store.isLoading) {
          clearInterval(interval);
          resolve(true);
        }
      }, 10);
    });
  }
  return new MiddlewareHandler(to).handle();
});

router.afterEach((to, from, failure) => {
  if (!failure) {
    setMetaAttributes(to, from);
    $bus.$emit(eventTypes.viewed_page, {
      ...to,
      name: document.title,
    });
  }
});

export default router;
