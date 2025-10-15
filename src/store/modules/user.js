import Vue from 'vue'
import Vuex from 'vuex'
import { setStore, removeStore } from '@/utils/store'
import { getUserInfo } from '@/api'
import jsonp from 'jsonp'
Vue.use(Vuex)

const state = () => {
  return {
    tokenInfo: '', // 用户token
    userInfo: {} // 用户信息
  }
}

const getters = {
  userInfo: state => state.userInfo
}

const mutations = {
  // 设置token
  SET_TOKENINFO (state, tokenInfo) {
    console.log(tokenInfo)
    removeStore({ name: 'access_token' })
    setStore({
      name: 'access_token',
      content: tokenInfo,
      type: 'session'
    })
    state.tokenInfo = tokenInfo
  },
  // 设置用户信息
  SET_USERINFO (state, data) {
    const userInfo = {
      ...data.tbpUser,
      ...data.tbpOrgan
    }
    state.userInfo = userInfo
  }
}

const actions = {
  fetchUserInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        commit('SET_USERINFO', res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
