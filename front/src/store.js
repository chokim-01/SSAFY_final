import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    SERVER_URL: "http://52.79.152.29//",

    isLog: true,
    user: {
      email: "",
      name: "",
      auth: ""
    },
    userCount: 0,
    todayCount: 0,
    paymentCount: 0,
    phishingCount: 0,
    tid: "",
    total_amount: ""
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    getisLog: state => {
      return state.isLog;
    },
    getTid: state => {
      return state.tid;
    },
    getTotalAmount: state => {
      return state.total_amount;
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
    },
    tid(state, tid) {
      state.tid = tid;
    },
    total_amount(state, total_amount) {
      state.total_amount = total_amount;
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
    },
    tid({ commit }, tid) {
      commit("tid", tid);
    },
    total_amount({ commit }, total_amount) {
      commit("total_amount", total_amount);
    }
  }
});
