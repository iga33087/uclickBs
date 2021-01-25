import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading:false,
    chartList:[],
    userInfo:"",
  },
  mutations: {
    loading(state,data) {
      state.loading=data
    },
    chartList(state,data) {
      state.chartList=data
    },
    userInfo(state,data) {
      state.userInfo=data
    }
  },
  actions: {
    loading({ commit },data) {
      commit('loading',data)
    },
    chartList({ commit },data) {
      commit('chartList',data)
    },
    userInfo({ commit },data) {
      commit('userInfo',data)
    }
  },
  modules: {
  }
})
