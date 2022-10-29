import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/Auth/LoginOrRegisterView.vue";
import ConfirmEmailView from "../views/Auth/ConfirmEmailView.vue";
import ResetPasswordVue from "@/forms/ResetPassword.vue";
import { useUserStore } from "@/stores/user";
import AboutViewVue from "../views/AboutView.vue";
import SettingsViewVue from "@/views/Auth/SettingsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
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
        await store.logout();
        next({ name: "login" });
      },
      component: LoginView,
    },

    {
      path: "/sign-up",
      name: "sign-up",
      component: LoginView,
      meta: {
        middleware: ["guest", "dontRedirect"],
      },
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: ResetPasswordVue,
      meta: {
        middleware: ["guest"],
      },
    },
    {
      path: "/confirm-email",
      name: "confirm-email",
      component: ConfirmEmailView,
      meta: {
        middleware: ["auth", "dontRedirect"],
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsViewVue,
      meta: {
        middleware: ["auth"],
      },
    },
    {
      path: "/rent",
      name: "rent",
      component: AboutViewVue,
      meta: {
        middleware: ["auth", "confirmed-email"],
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
  if (
    middleware &&
    (middleware.includes("auth") ||
      middleware.includes("guest") ||
      middleware.includes("confirmed-email"))
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
  }
  if (middleware && middleware.includes("guest")) {
    // if so, redirect to the home page
    if (store.isAuthenticated) {
      return {
        name: "home",
      };
    }
  }
  if (middleware && middleware.includes("confirmed-email")) {
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
  }
  // // Finally, if there is a redirect query param, redirect to that
  if (
    to.query.redirect &&
    !(middleware && middleware.includes("dontRedirect"))
  ) {
    return {
      name: to.query.redirect as string,
    };
  }
});

export default router;
