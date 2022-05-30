import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/Home/:username',
    component: Home,
  },
]

const router = new VueRouter({
  routes
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to 目标  from 从哪里来  next()放行 next('/xxx')强制跳转到xxx
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router