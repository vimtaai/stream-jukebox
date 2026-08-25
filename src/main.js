import { createApp } from "vue";
import App from "./App.vue";

import { initializeMobile } from "./services/mobile.js";
import { setupActionHandlers } from "./services/playback.js";

import "../styles/config.css";
import "../styles/common.css";

initializeMobile();
setupActionHandlers();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register("./sw.js");
}

const app = createApp(App);
app.mount("#app");
