import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import elementUI from 'element-ui'
import i18n from './i18n'

import jsonp from 'jsonp';

import axios  from 'axios'

import '@/assets/iconfont/iconfont.css';/* iconfont */

Vue.prototype.$copyObj = '';

Vue.prototype.$jsonp = jsonp;

Vue.prototype.$axios = axios;

Vue.use(elementUI)

new Vue({
  router,
  store,
  el: '#app',
  i18n,
  render: h => h(App)
})
