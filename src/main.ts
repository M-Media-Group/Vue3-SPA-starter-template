import { createApp } from "vue";
import { createPinia } from "pinia";

import axios from "axios";

import App from "./App.vue";
import router from "./router";

// Event bus listeners
import "./eventBus/listeners/index";

import "@picocss/pico";
import "./assets/main.css";
import i18n from "./locales/i18n";

const app = createApp(App);

axios.defaults.withCredentials = true;
// Set accept header
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
