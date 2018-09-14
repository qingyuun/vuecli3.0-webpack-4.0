// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import { router } from './router/router'
import { ajax } from 'jquery'
import http from './utils/http'
import cookie from './utils/cookie'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import './assets/app.scss'

Vue.config.productionTip = false
Vue.use(ElementUI, http)
Vue.prototype.axios = http
Vue.prototype.ajax = ajax
Vue.prototype.cookie = cookie

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
