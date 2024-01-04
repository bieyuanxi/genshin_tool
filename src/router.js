import { createRouter, createWebHashHistory } from "vue-router"

import Chart from "./components/Chart.vue"
import Setting from "./components/Setting.vue"
import NotFound from "./components/NotFound.vue"
import Statistics from "./components/Statistics.vue"
import About from "./components/About.vue"

import Debug from "./components/Debug.vue"

const routes = [
  { path: '/statistics', component: Statistics },
  {
    path: '/setting', component: Setting,
    children: [
      {
        path: 'about',
        components: {
          sub_view: About
        }
      },
      {
        path: 'debug',  //debug
        components: {
          sub_view: Debug
        }
      },
    ]
  },

  { path: '/chart', component: Chart },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})



export default router;
