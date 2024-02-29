import { createApp } from "vue";
import { error } from "tauri-plugin-log-api";

import { resolveResource } from '@tauri-apps/api/path'
import { readTextFile } from '@tauri-apps/api/fs'

import "./styles.css";
import App from "./App.vue";

import router from "./router"
import { create_table } from "./db"
import { loadUser } from "./store"
import { firstPage } from "./config";
import { defaultLang } from "./i18n";

//TODO: read lang from config
//TODO: lang file !exists...
let loadThisLang = 'lang/en.json';

const lang = await resolveResource(loadThisLang)
  .then((fullpath) => readTextFile(fullpath))
  .then((json) => JSON.parse(json), (reason) => defaultLang());

console.log(lang)

await create_table(); // create db tables
await loadUser();
await router.replace(firstPage);

// Vue App
const app = createApp(App);
app.config.errorHandler = (err, instance, info) => {
  // 处理错误，例如：报告给一个服务
  console.error(err);
  error(err.toString());
}
app.use(router).mount('#app');
