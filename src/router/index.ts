import { createRouter, createWebHistory } from "vue-router";
import $bus, { eventTypes } from "@/eventBus/events";
import authRoutes from "./authRoutes";
import { ref } from "vue";

export const navIsLoading = ref(true);

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
        gates: ["auth"],
      },
    },
    {
      path: "/add-payment-method",
      name: "add-payment-method",
      component: () => import("../views/AddPaymentMethodView.vue"),
      meta: {
        gates: ["auth"],
      },
    },
    {
      path: "/about",
      name: "about",
      meta: {
        gates: ["auth", "confirmedPassword"],
      },
      component: () => import("../views/AboutView.vue"),
    },
    // Add a catch-all 404 page
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/404View.vue"),
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

router.beforeEach(() => {
  navIsLoading.value = true;
});

router.afterEach((to, from, failure) => {
  navIsLoading.value = false;
  if (!failure) {
    $bus.$emit(eventTypes.viewed_page, {
      ...to,
      name: document.title,
    });
  }
});

export default router;
