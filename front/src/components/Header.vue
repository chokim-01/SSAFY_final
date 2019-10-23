<template>
  <v-app-bar app>
    <v-toolbar-title class="headline text-uppercase" xs12>
      <router-link to="/" class="moveHome">Previewer</router-link>
    </v-toolbar-title>

    <v-spacer />

    <!-- user Login /LogOut  -->
    <LogIn v-if="check" />
    <UserInfo v-else />
  </v-app-bar>
</template>

<script>
import EventBus from "../EventBus.js"

export default {
  name: "Header",

  data(){
        return{
          check:true,
          userInfo:{},
          auth: JSON.parse(sessionStorage.getItem("userInfo"))
        }
    },

  components: {
    LogIn: () => import("./LogIn.vue"),
    UserInfo :()=>import("./UserInfo.vue")
  },

  created() {
    EventBus.$on("userInfo", () => this.check= false)
    console.log(sessionStorage.getItem("userInfo"));
    if(JSON.parse(sessionStorage.getItem("userInfo")) != null){
      this.check = false;
    }else{
      this.check = true;
    }
  },
  updated(){
    this.userInfo = sessionStorage.getItem("userInfo")
  }
};
</script>

<style scoped>
.moveHome {
  text-decoration:none;
  color: black;
}
</style>
