import { useUserStore } from "@/stores/user";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Auth/LoginOrRegisterView.vue"),
    meta: {
      gates: ["guest"],
    },
  },
  // A logout route that just calls the logout on userStore, then redirects to login
  {
    path: "/logout",
    name: "logout",
    beforeEnter: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      return logout(next);
    },
    component: () => import("../views/Auth/LoginOrRegisterView.vue"),
    meta: {
      gates: ["auth"],
    },
  },

  {
    path: "/sign-up",
    name: "sign-up",
    component: () => import("../views/Auth/LoginOrRegisterView.vue"),
    meta: {
      gates: ["guest"],
    },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("../forms/ForgotPassword.vue"),
    meta: {
      gates: ["guest"],
    },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("../forms/ResetPassword.vue"),
    meta: {
      gates: ["guest"],
    },
  },
  {
    path: "/confirm-password",
    name: "confirm-password",
    component: () => import("../views/Auth/ConfirmPasswordView.vue"),
    meta: {
      gates: ["auth"],
    },
  },
  {
    path: "/confirm-email",
    name: "confirm-email",
    component: () => import("../views/Auth/ConfirmEmailView.vue"),
    meta: {
      gates: ["auth", "unconfirmedEmail"],
    },
  },
  {
    path: "/confirm/:element",
    name: "confirm",
    component: () => import("../views/ConfirmView.vue"),
  },
];

const logout = async (next: NavigationGuardNext) => {
  const store = useUserStore();
  await store.isReady;
  await store.logout();
  return next({ name: "login" });
};
