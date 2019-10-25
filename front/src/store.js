import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    SERVER_URL: " http://localhost:5000/",

    isLog: true,
    user: {
      email: "",
      name: "",
      auth: ""
    },
    userCount: 0,
    todayCount: 0,
    paymentCount: 0,
    phishingCount: 0
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    getisLog: state => {
      return state.isLog;
    }
  },
  mutations: {
    isLog: function(state, payload) {
      state.isLog = payload;
    },
    login(state, userInfo) {
      state.user = userInfo;
    },
    logout(state) {
      state.user = null;
    }
  },
  actions: {
    isLog({ commit }, payload) {
      commit("isLog", payload);
    },
    login({ commit }, userInfo) {
      commit("login", userInfo);
    },
    logout({ commit }) {
      commit("logout");
    }
  }
});
