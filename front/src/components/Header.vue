<template>
  <v-app-bar app>
    <v-toolbar-title class="headline text-uppercase" xs12>
      <span>Previewer</span>
    </v-toolbar-title>

    <v-spacer />
    <!-- Before Login -->
    <div v-if="check()">
      <v-dialog v-model="dialog" persistent max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">Log In</v-btn>
        </template>

        <v-card class="text-center">
          <v-card-title class="headline">
            <span>Log In Below</span>
          </v-card-title>

          <v-card-text>
            <v-flex xs12>
              <v-text-field v-model="email" label="Email*" required />
            </v-flex>

            <v-flex xs12>
              <v-text-field
                v-model="password"
                type="password"
                label="Password*"
                @keyup.enter="loginWithEmail"
                required
              />
            </v-flex>

            <v-flex xs12>
              <v-btn @click="loginWithEmail()" rounded color="green" dark>
                <v-icon class="mr-2">mdi-email</v-icon>
                <span>email 로그인</span>
              </v-btn>
            </v-flex>
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn @click="dialog = false" color="green darken-1" text>
              <span>close</span>
            </v-btn>
            <!-- USer Sign Up -->
            <SignUp />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- After Login -->
    <div v-else text-center>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <!-- User Name -->
        <v-card width="250">
          <v-flex xs8>
            <v-card-text>
              <h2>{{isuser().name}}</h2>
              <br />
            </v-card-text>

            <!-- User Activate -->
            <v-card-text>
              <v-btn @click="signOut()" color="error">
                <v-icon>mdi-logout</v-icon>
              </v-btn>

              <v-btn color="success" to="mypage">
                <v-icon>mdi-account-edit</v-icon>
              </v-btn>
            </v-card-text>

            <!-- Admin Page -->
            <v-card-text>
              <v-list v-if="isuser().auth=='admin'" class="text-center">
                <v-btn to="/adminpage" color="warning">관리자페이지</v-btn>
              </v-list>
            </v-card-text>
          </v-flex>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import Server from "../server.js"
export default {
   name: "Header",
  data(){
        return{
          name: "",
          email: "",
          password: "",
          grade:"member",
          dialog : false, 
          rule: {
            required: v => !!v || "필수항목",
            email: v => /.+@.+/.test(v) || "이메일 형식입력",
            minLength: length => v => v.length >= length || `${length}자리 이상`,
            maxLength: length => v => v.length <= length || `${length}자리 이하`
      }
        }
    },
  components: {
    SignUp: () => import("./SignUp.vue")
  },
   methods: {
      check(){
        return this.$store.getters.getisLog
     },
     isuser(){
        return this.$store.getters.getUser
     },
     async loginWithEmail () {
       let userdata = {
        email : this.email,
        password : this.password
      }
      Server(this.$store.state.SERVER_URL).post("/post/signIn",userdata).then((res)=>{
        if(res.data.result=="true"){
          alert("로그인 성공")
          let userInfo ={ email : res.data.email,name: res.data.name,auth:res.data.auth}
          this.$store.dispatch("login",userInfo)
          this.$store.dispatch("isLog",false)
        }else{
          alert(res.data.message)
          this.email = ""
          this.password=""
        }
      })
      this.dialog = false
    },
    
    async signOut () {
      this.email = ""
      this.password = ""
      this.$store.dispatch("isLog",true)
      this.$store.dispatch("logout")
      if(window.location.pathname!="/" ){
        this.$router.push("/")

      }
    
    }
  }
};
</script>
