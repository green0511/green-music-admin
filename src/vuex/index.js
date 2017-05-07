import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  token: null
}

const getters = {
  token: state => state.token
}

const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
    localStorage.setItem('token', token)
  }
}

const actions = {
  setToken ({ commit, state }, token) {
    commit('SET_TOKEN', token)
  },
  toast ({ commit }, {msg, success, vm}) {
    let type = success ? 'success' : 'error'
    if (!msg) {
      msg = '操作' + (success ? '成功' : '失败')
    }
    vm.$message({
      message: msg,
      type
    })
  }
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
