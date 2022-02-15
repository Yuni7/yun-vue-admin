import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    routerList: [] // 用于存储路由表
  },
  mutations: {
    // 用于获取路由表
    SET_ROUTER(state, routerList) {
      state.routerList = routerList
    }
  },
  modules: {
    app,
    settings,
    user,
    tagsView
  },
  getters
})

export default store
