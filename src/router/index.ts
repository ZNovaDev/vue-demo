import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'              // 顶部进度条（可选）

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})


router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度条
  // 检查路由是否需要认证
  if (to.meta.auth) {
    const token = localStorage.getItem('token')

    // token 不存在，跳转登录页
    if (!token) {
      next('/login')
      return
    }

    // 验证 token 是否过期
    try {
      // 1. 取出 payload 部分
      const payload = token.split('.')[1]

      // 2. URL-safe Base64 转标准 Base64 并解析
      const { exp } = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))

      // 3. 检查过期时间 (exp 是秒，Date.now() 是毫秒)
      if (Date.now() >= exp * 1000) {
        // token 过期，清除并跳转登录页
        ElMessage.error('登录过期，请重新登录')
        localStorage.removeItem('token')
        next('/login')
      } else {
        // token 有效，放行
        next()
      }
    } catch {
      // token 解析失败，视为无效 token
      ElMessage.error('登录信息无效，请重新登录')
      localStorage.removeItem('token')
      next('/login')
    }
  } else {
    // 不需要认证，直接放行
    next()
  }

})

router.afterEach((to, from) => {
  NProgress.done() // 结束进度条
})

export default router