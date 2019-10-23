import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import MyPage from "./views/MyPage.vue";
import AdminPage from "./views/AdminPage.vue";
import UserRequest from "./views/UserRequest.vue";
import UserInfo from "./views/UserInfo.vue";

Vue.use(Router);

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
      component: MyPage
    },
    {
      path: "/UserInfo",
      name: "UserInfo",
      component: UserInfo
    },
    {
      path: "/adminpage",
      name: "adminpage",
      component: AdminPage
    },
    {
      path: "/userrequest",
      name: "UserRequest",
      component: UserRequest,
      props: router => ({ id: router.query.id })
    }
  ]
});
