import { createApp } from "vue";
import App from "./App.vue";

import { initializeMobile } from "./services/mobile.js";

import "../styles/config.css";
import "../styles/common.css";

initializeMobile();

const app = createApp(App);
app.mount("#app");
