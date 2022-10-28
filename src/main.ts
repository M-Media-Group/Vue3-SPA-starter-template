import { createApp } from "vue";
import { createPinia } from "pinia";

import axios from "axios";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

axios.defaults.withCredentials = true;
// Set accept header
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["CONTENT_TYPE"] = "application/json";
app.use(createPinia());
app.use(router);

app.mount("#app");
