
import Vue from 'vue'
import Router from 'vue-router'
import { appRouterMap } from './index'
import cookie from '../utils/cookie'

Vue.use(Router)

const RouterConfig = {
  routes: appRouterMap
  // mode: 'history'
}

export const router = new Router(RouterConfig)

const needLogin = ['userCenter', 'userCenter/index', 'user', 'myCourse', 'myOrder']

router.beforeEach((to, from, next) => {
  if (needLogin.indexOf(to.name) !== -1) {
    if (!cookie.get('token') && to.name !== 'Login') {
      // 不存在token  且 前往页面不是 login  自动跳转至 login
      next({
        name: 'Login'
      })
    } else {
      // 存在 token 前往页面
      // debugger
      if (localStorage['roles']) {
        let roles = localStorage['roles'].split(',')
        if (roles.indexOf('Admin') === -1) {
          if (to.meta.role !== undefined && roles.indexOf(to.meta.role) !== -1) {
            next()
          } else if (to.meta.role === undefined) {
            next()
          } else {
            next({ name: '403' })
          }
        } else {
          next()
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

router.afterEach((to) => {
  window.scrollTo(0, 0)
})
