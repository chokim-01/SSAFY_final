<template>
  <div justify-end>
    <v-card>
      <v-card-title class="headline">
        <span>Information Update Below</span>
      </v-card-title>

      <v-card-text>
        <v-spacer />

        <!-- User Email  -->
        {{userInfo.email}}
        <v-spacer />

        <v-text-field v-model="name" type="text" label="Name" />

        <v-text-field v-model="password" label="Password" type="password" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <!--변경 취소홈으로 가기-->
        <v-btn color="darken-1" text @click="clear()">
          <span>cancel</span>
        </v-btn>

        <!--변경완료 홈으로 가기  -->
        <v-btn color="darken-1" text @click="modify()">
          <span>변경완료</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
    name: "Modify",

     data: () => ({
        userInfo:{},
        name : "",
        password:"",

    }),

    methods:{
        clear(){
            this.name = ""
            this.password = ""
            this.$router.push("/")
        },
        modify(){
        let userdata = {
            email : this.userInfo.email,
            name : this.name,
            password : this.password,
            grade : this.userInfo.grade
        }
        this.$http.post("/update",userdata).then((res)=>{
            if(res.status == 200){
            alert("변경성공")
            this.$router.push("/")
            }
      })


        }
    },
    created(){
    this.userInfo= JSON.parse(sessionStorage.getItem("userInfo"))
    },

    
}
</script>