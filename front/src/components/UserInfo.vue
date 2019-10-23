<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-card width="200">
        <v-flex xs8>
          <!-- UserName -->
          <v-card-text>
            {{userInfo.name}}
            <br />
          </v-card-text>

          <!-- User LogOut / Edit -->
          <v-card-text>
            <v-btn @click="signOut()" color="error">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
            <v-btn color="success" to="mypage">
              <v-icon>mdi-account-edit</v-icon>
            </v-btn>
          </v-card-text>

          <!-- Admin -->
          <v-card-text>
            <v-list v-if="userInfo.grade=='master'" class="text-center">
              <v-btn to="/adminpage" color="warning">관리자페이지</v-btn>
            </v-list>
          </v-card-text>
        </v-flex>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
name: "UserInfo",

  data: () => ({
   userInfo: JSON.parse(sessionStorage.getItem("userInfo"))
  }),
  computed:{

    getUserEmail(){
      return sessionStorage.getItem("userInfo").email
    }
  },
  created(){
    this.userInfo= JSON.parse(sessionStorage.getItem("userInfo"))
  },

  updated(){
    this.userInfo= JSON.parse(sessionStorage.getItem("userInfo"))
  },

  methods:{
    async signOut () {
      sessionStorage.clear()
       this.$router.push("/")
       location.reload()
    }
  },

};
</script>
