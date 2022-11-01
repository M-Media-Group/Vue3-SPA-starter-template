import { createApp } from "vue";
import { createPinia } from "pinia";

import { createI18n } from "vue-i18n";

import axios from "axios";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

const app = createApp(App);

// Get the current locale from the browser
let locale =
  localStorage.getItem("locale") ?? navigator.language.split("-")[0] ?? "en";
// If the locale is not supported, fallback to English
if (!["en", "fr"].includes(locale)) {
  locale = "en";
}

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: locale, // set locale
  fallbackLocale: "en", // set fallback locale
  messages: {
    en: en,
    fr: fr,
  },
  // something vue-i18n options here ...
});

axios.defaults.withCredentials = true;
// Set accept header
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
