import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    redirect: '/welcome',
    children: [
      { path: '/welcome',
        name: 'welcome',
        component: () => import('@/views/welcome/Welcome.vue')
      },
      { path: '/articleList',
        name: 'articleList',
        component: () => import('@/views/article/ArticleList.vue')
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next({ name: 'login' })
  }
  next()
})

export default router
