import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  emaillist: window.sessionStorage.getItem('lq-emaillist'),
  emailfolder: window.sessionStorage.getItem('lq-emailfolder')
}

const mutations = {
  EMAILLIST: (state, data) => {
    state.emaillist = data
    window.sessionStorage.setItem('lq-emaillist', data)
  },
  EMAILFOLDER: (state, data) => {
    state.emailfolder = data
    window.sessionStorage.setItem('lq-emailfolder', data)
  }
}

const actions = {
  EmailList ({ commit }, data) {
    commit('EMAILLIST', data)
  },
  EmailFolder ({ commit }, data) {
    commit('EMAILFOLDER', data)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
