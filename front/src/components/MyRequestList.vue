<template>
  <v-container>
    <!-- User Name -->
    <v-layout>
      <v-flex id="userName">회원명 : {{userInfo.name}}</v-flex>
    </v-layout>
    ​
    <!-- Payment / Payment History -->
    <v-layout mb-3>
      <v-flex offset-xs8 offset-md10 offsest-sm8>
        <v-dialog v-model="dialog" width="1000">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" min-width="90px">
              <span>결제</span>
            </v-btn>
          </template>
          ​
          <payment />
        </v-dialog>
        ​
        <v-btn min-width="80px">
          <span>결제내역</span>
        </v-btn>
      </v-flex>
    </v-layout>
    ​
    <!-- urlRequestList -->
    <v-data-table :headers="headers" :items="urlRequestList">
      <template v-slot:urlRequestList.result="{urlRequestList}">
        <v-chip :color="getColor(urlRequestList.result)" dark>{{urlRequestList.result}}</v-chip>
      </template>
    </v-data-table>
    ​
    <!-- User Modify / User Delete -->
    <v-layout mt-3>
      <v-flex offset-xs8 offset-md10>
        <v-btn to="UserInfo" min-width="90px">
          <span>수정</span>
        </v-btn>
        ​
        <v-btn @click="userOut()" min-width="90px">
          <span>탈퇴</span>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
​
<script>
export default {
  data: () => ({
    userInfo:{},
    //test data
    headers:[
      {
        text:"url",
        value:"url"
      },
      {
        text:"result",
        value:"result"
      },
      {
        text:"",
        value:"deleteurl"
      }
    ],
    urlRequestList: [
      {
        url:"https://www.naver.com",
        result:"true",
        deleteurl:""
      },
      {
        url:"https://www.google.com",
        result:"false",
        deleteurl:""
      },
      {
        url:"https://edu.ssafy.com/comm/login/SecurityLoginForm.do",
        result:"true",
        deleteurl:""
      },
      {
        url:"https://github.com",
        result:"true",
        deleteurl:""
      },
      {
        url:"111.111.111.111",
        result:"false",
        deleteurl:""
      },
      {
        url:"222.222.111.222",
        result:"false",
        deleteurl:""
      },
      {
        url:"333.444.333.111",
        result:"true",
        deleteurl:""
      },
    ],
    dialog:false
  }),
  created(){
    this.userInfo= JSON.parse(sessionStorage.getItem("userInfo"))
  },
  components :{
    payment: () => import("./Payment")
  },
  methods:{
    userOut(){
      let userdata = {
        email : this.userInfo.email,
        grade : this.userInfo.grade
      }
      this.$http.post("/userOut",userdata).then((res)=>{
        console.log(res)
      })
    },
    getColor(str){
      if(str=="false") return "red"
      else return "green"
    }
  }
}
</script>
​
<style scoped>
#userName {
  font-weight: bold;
  font-size: 2em;
}
</style>
