import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import elementUI from 'element-ui'

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
  render: h => h(App)
})
