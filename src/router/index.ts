import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/Auth/LoginOrRegisterView.vue";
import ConfirmEmailView from "../views/Auth/ConfirmEmailView.vue";
import ResetPasswordVue from "@/forms/ResetPassword.vue";
import { useUserStore } from "@/stores/user";

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
        middleware: ["guest"],
      },
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: LoginView,
      meta: {
        middleware: ["guest"],
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
      // requires auth
      meta: {
        middleware: ["auth"],
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
    (middleware.includes("auth") || middleware.includes("guest"))
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
  } else if (middleware && middleware.includes("confirmed-email")) {
    // check if the user has confirmed their email
    const hasConfirmedEmail = false;
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
});

export default router;
