import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    SERVER_URL: " http://localhost:5000/",
    userCount: 0,
    todayCount: 0,
    paymentCount: 0,
    phishingCount: 0
  },
  mutations: {

  },
  actions: {

  }
})
