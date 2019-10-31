import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import MyPage from "./views/MyPage.vue";
import AdminPage from "./views/AdminPage.vue";
import UserRequest from "./views/UserRequest.vue";
import PayComplete from "./views/PayComplete.vue";
import store from "./store";
Vue.use(Router);

// Router Access Control
const requireAuth = () => (to, from, next) => {
  if (store.state.user !== null) {
    if (store.state.user.auth === "admin") {
      return next();
    }
    next("/");
  }
  next("/");
};
const requireUser = () => (to, from, next) => {
  if (store.state.user !== null) {
    return next();
  }
  next("/");
};
export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/mypage",
      name: "mypage",
      component: MyPage,
      beforeEnter: requireUser()
    },
    {
      path: "/adminpage",
      name: "adminpage",
      component: AdminPage,
      beforeEnter: requireAuth()
    },
    {
      path: "/userrequest",
      name: "UserRequest",
      component: UserRequest,
      props: router => ({ id: router.query.id })
    },
    {
      path: "/payComplete",
      name: "payComplete",
      component: PayComplete
    }
  ]
});
