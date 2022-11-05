import { createRouter, createWebHistory } from "vue-router";
import { handleMiddleware } from "./middlewareHandler";
import { setMetaAttributes } from "./metaTagsHandler";
import $bus, { eventTypes } from "@/eventBus/events";
import authRoutes from "./authRoutes";

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
        middleware: ["auth", "dontRedirect"],
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
      component: () => import("../views/AboutView.vue"),
    },
  ].concat(authRoutes),
});

router.beforeEach(async (to, from) => {
  const middlewareResponse = await handleMiddleware(to, from);
  if (middlewareResponse !== null) {
    return middlewareResponse;
  }
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
