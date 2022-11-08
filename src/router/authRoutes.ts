import { useUserStore } from "@/stores/user";
import type { NavigationGuardNext } from "vue-router";

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Auth/LoginOrRegisterView.vue"),
    meta: {
      middleware: ["guest"],
    },
  },
  // A logout route that just calls the logout on userStore, then redirects to login
  {
    path: "/logout",
    name: "logout",
    beforeEnter: async (to: any, from: any, next: NavigationGuardNext) => {
      return logout(next);
    },
    component: () => import("../views/Auth/LoginOrRegisterView.vue"),
    meta: {
      middleware: ["auth"],
    },
  },

  {
    path: "/sign-up",
    name: "sign-up",
    component: () => import("../views/Auth/LoginOrRegisterView.vue"),
    meta: {
      middleware: ["guest"],
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
    path: "/confirm-password",
    name: "confirm-password",
    component: () => import("../views/Auth/ConfirmPasswordView.vue"),
    meta: {
      middleware: ["auth"],
    },
  },
  {
    path: "/confirm-email",
    name: "confirm-email",
    component: () => import("../views/Auth/ConfirmEmailView.vue"),
    meta: {
      middleware: ["auth", "unconfirmedEmail"],
    },
  },
];

const logout = async (next: NavigationGuardNext) => {
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
};
