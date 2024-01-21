import { createRouter, createWebHashHistory } from "vue-router"

import Chart from "./components/Chart.vue"
import Setting from "./components/Setting.vue"
import NotFound from "./components/NotFound.vue"
import Statistics from "./components/Statistics.vue"
import About from "./components/About.vue"
import DataTable from "./components/DataTable.vue"
import Login from "./pages/login.vue"
import LoginGenshin from "./pages/LoginGenshin.vue"

import Debug from "./components/Debug.vue"

const routes = [
  { path: '/login', component: LoginGenshin },
  { path: '/statistics', component: Statistics },
  { path: '/data_table', component: DataTable },
  {
    path: '/setting', component: Setting,
    children: [
      {
        path: 'about',
        components: {
          sub_view: About
        }
      },
      // {
      //   path: 'debug',  //debug
      //   components: {
      //     sub_view: Debug
      //   }
      // },
    ]
  },

  { path: '/chart', component: Chart },

  { path: '/debug', component: Debug },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})



export default router;
