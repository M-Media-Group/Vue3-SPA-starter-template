import type { Preview, VueRenderer } from "@storybook/vue3";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

import "@/assets/main.css";

import i18n from "../src/locales/i18n";
import { setup } from "@storybook/vue3";
import { type App } from "vue";
import { EventsPlugin } from "../src/eventBus/events";
import { createPinia } from "pinia";
import { navIsLoading } from "../src/router";
import { vueRouter } from "storybook-vue3-router";

setup((app: App) => {
  app.use(createPinia());
  app.use(i18n);
  app.use(EventsPlugin);

  /** We need to set navIsLoading to false otherwise it never resolves becasuse the router guards don't seem to be called @todo check this */
  navIsLoading.value = false;
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Don/t show background color for the preview since we use the light/dark switcher
    backgrounds: {
      disable: true,
    },
  },
};

preview.decorators = [
  /* this is the basic setup with no params passed to the decorator */
  vueRouter(),
  withThemeByDataAttribute<VueRenderer>({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "light",
    attributeName: 'data-theme',
  }),
];


export default preview;
