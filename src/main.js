import { createApp } from "vue";
import { error } from "tauri-plugin-log-api";

import "./styles.css";
import App from "./App.vue";

import router from "./router"

const app = createApp(App);
app.config.errorHandler = (err, instance, info) => {
    // 处理错误，例如：报告给一个服务
    console.log(err);   error(err);
  }
app.use(router).mount('#app');
