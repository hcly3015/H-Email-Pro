import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layout'

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete, onAbort) {
  return routerPush.call(this, location, onComplete, onAbort).catch(error => error)
}

Vue.use(Router)

const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/Redirect')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/empty',
    children: [
      {
        path: 'empty',
        component: () => import('@/views/Emptypage'),
        name: 'EmptyPage',
        meta: { title: 'EmptyPage', icon: 'emptypage', affix: true }
      }
    ]
  },
  {
    path: '/send',
    component: Layout,
    children: [
      {
        path: '/',
        component: () => import('@/views/Send'),
        name: 'send',
        meta: { title: 'send', icon: 'send', affix: true }
      }
    ]
  },
  {
    path: '/browse',
    component: Layout,
    children: [
      {
        path: '/browse',
        component: () => import('@/views/Browse'),
        props: true,
        name: 'browse',
        meta: { title: 'browse', icon: 'browse', affix: true }
      }
    ]
  },
  {
    path: '/signature',
    component: () => import('@/views/Signature'),
    props: true,
    name: 'signature',
    meta: { title: 'signature', icon: 'signature', affix: true }
  },
  {
    path: '/readstate',
    component: Layout,
    children: [
      {
        path: '/readstate',
        component: () => import('@/views/Readstate'),
        props: true,
        name: 'readstate',
        meta: { title: 'readstate', icon: 'readstate', affix: true }
      }
    ]
  },
  {
    path: '/success',
    component: Layout,
    children: [
      {
        path: '/success',
        component: () => import('@/views/Success'),
        props: true,
        name: 'success',
        meta: { title: 'success', icon: 'success', affix: true }
      }
    ]
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
