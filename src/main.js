import Vue from 'vue'
import App from './App'
import router from './router'
import { api } from './api'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

import store from './vuex'

let token = localStorage.getItem('token')
api.setToken(token, true)

import './assets/normalize.css'
import './assets/global.less'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
