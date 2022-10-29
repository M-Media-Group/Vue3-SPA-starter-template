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

const i18n = createI18n({
    legacy: false, // you must set `false`, to use Composition API
    locale: "en", // set locale
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
axios.defaults.headers.common["CONTENT_TYPE"] = "application/json";

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
