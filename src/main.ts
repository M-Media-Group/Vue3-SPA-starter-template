import { createPinia } from "pinia";

import axios from "axios";

import App from "./App.vue";

// Event bus listeners
import "./eventBus/listeners/index";

import VueGtagPlugin from "vue-gtag";
import "./assets/main.css";
import i18n, { SUPPORT_LOCALES } from "./locales/i18n";
import { gatePlugin } from "@m-media/vue3-gate-keeper";

import gates from "./router/gates";
import { metaTagPlugin } from "@m-media/vue3-meta-tags";
import { EventsPlugin } from "./eventBus/events";
import { ViteSSG } from "vite-ssg";
import { allRoutes } from "./router";

// `export const createApp` is required instead of the original `createApp(App).mount('#app')`
export const createApp = ViteSSG(
  // the root component
  App,
  // vue-router options
  { routes: allRoutes },
  // function to have custom setups
  ({ app, router, routes, isClient, initialState }) => {
    const pinia = createPinia();
    app.use(pinia);

    if (import.meta.env.SSR) initialState.pinia = pinia.state.value;
    else pinia.state.value = initialState.pinia || {};

    app.use(i18n);

    app.use(
      gatePlugin,
      {
        gateInstances: gates,
      },
      router
    );

    app.use(
      metaTagPlugin,
      {
        defaultName: import.meta.env.VITE_APP_NAME,
        defaultLocale: i18n.global.locale.value,
        locales: SUPPORT_LOCALES,
        preconnect: [
          import.meta.env.VITE_API_URL,
          "https://js.stripe.com",
          "https://hooks.stripe.com",
          "https://api.stripe.com",
          "https://www.googletagmanager.com",
        ],
        textCallback: (text: string) => {
          return i18n.global.t(text);
        },
      },
      router
    );

    app.use(
      VueGtagPlugin,
      {
        enabled: import.meta.env.PROD,
        bootstrap: import.meta.env.PROD,
        appName: import.meta.env.VITE_APP_NAME,
        config: { id: import.meta.env.VITE_GA_MEASUREMENT_ID },
        pageTrackerEnabled: false,
      },
      router
    );

    app.use(EventsPlugin);
  }
);

axios.defaults.withCredentials = true;
// Set accept header
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
