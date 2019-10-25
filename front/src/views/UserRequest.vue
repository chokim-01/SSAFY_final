<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs8>
        <router-link class="moveAdmin" to="/adminpage"> <<돌아가기 </router-link>
      </v-flex>
      <v-flex xs4 mb-10>
        <span>
          Email : {{sendEmail}}
        </span>
      </v-flex>
    </v-layout>
    <OneUserRequest :email="sendEmail" />
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name : "UserRequest",
  data: () => ({
    sendEmail : "",
  }),
  components :{
    OneUserRequest : () => import("@/components/OneUserRequest"),
  },
  created(){
    this.sendEmail = this.$route.params.id;
  },
}
</script>
<style scoped>
.moveAdmin {
  text-decoration: none;
  color: orange;
  font-size: 23px;
}
</style>
