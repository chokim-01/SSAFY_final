<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <!--Button to vue -->
    <template v-slot:activator="{ on }">
      <v-btn class="mx-10" min-width="90px" v-on="on">정보 수정</v-btn>
    </template>

    <!-- User Information Edit -->
    <v-card class="text-center">
      <v-card-title class="headline">
        <span>Information Update Below</span>
      </v-card-title>

      <v-card-text>
        <v-flex xs12>
          <h2>{{isuser().email}}</h2>
        </v-flex>

        <v-text-field v-model="name" type="text" label="Name" />
        <v-text-field v-model="password" label="Password" type="password" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <!--Edit Cancel-->
        <v-btn @click="cancel()" color="darken-1" text>
          <span>cancel</span>
        </v-btn>

        <!--Edit Compelte -->
        <v-btn @click="modify()" color="darken-1" text>
          <span>변경완료</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Server from "../server.js"
export default {
    name: "Modify",

     data: () => ({
        userInfo:{},
        name : "",
        password:"",
        dialog : false

    }),
    methods:{
      isuser(){
        return this.$store.getters.getUser
     },
      cancel(){
          this.dialog = false,
          this.name = ""
          this.password = ""
      }
      ,
        modify(){
        let userdata = {
            email : this.$store.getters.getUser.email,
            name : this.name,
            password : this.password,
        }
        Server(this.$store.state.SERVER_URL).post("/post/editUser",userdata).then((res)=>{
            if(res.status == 200){
            alert(res.data.message)
            this.$store.dispatch("isLog",true)
            this.$store.dispatch("logout")
            this.$router.push("/")
            }
      })
      }
    }
}
</script>
