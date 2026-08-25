import { createApp } from "vue";
import App from "./App.vue";

import { initializeMobile } from "./services/mobile.js";
import { setupActionHandlers } from "./services/playback.js";

import "../styles/config.css";
import "../styles/common.css";

initializeMobile();
setupActionHandlers();

const app = createApp(App);
app.mount("#app");
