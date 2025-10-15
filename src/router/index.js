import Vue from 'vue'
import routes from './routes'
import Router from 'vue-router'
import { initWebSocket } from '@/socket/socket'
const { photoUrl } = window.__gconf
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
import store from '@/store'
import { fetchUserInfo } from '@/api'
Vue.use(Router)

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token && !store.state.user.uid) {
    fetchUserInfo().then(res => {
      console.log("用户信息", res);
      document.title = res.data.pc_page_title;
      initWebSocket()
      const userInfo = res.data.user_info
      store.dispatch('updataUser', {
        ...res.data,
        name: userInfo.username,
        img: photoUrl + userInfo.photo,
        uid: userInfo.id
      })
    })
  }


  if (!token && (to.path != '/login' && to.path != '/reg')) {
    next('/login')
  } else {
    next()
  }
})

export default router
