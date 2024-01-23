import { createRouter, createWebHashHistory } from "vue-router"

// 用动态导入代替静态导入,把不同路由对应的组件分割成不同的代码块
const Chart = () => import("./components/Chart.vue")
const Setting = () => import("./components/Setting.vue")
const NotFound = () => import("./components/NotFound.vue")
const Statistics = () => import("./components/Statistics.vue")
const About = () => import("./components/About.vue")
const DataTable = () => import("./components/DataTable.vue")
const Login = () => import("./pages/login.vue")
const LoginQRcode = () => import("./pages/LoginQRcode.vue")
const Home = () => import("./pages/Home.vue")

const Debug = () => import("./components/Debug.vue")

const routes = [
  { path: '/home', component: Home },
  { path: '/login', component: LoginQRcode },
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
