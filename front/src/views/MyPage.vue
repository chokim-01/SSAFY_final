<template>
  <v-container>
    <!-- User Name -->
    <v-layout class="mt-10">
      <v-flex id="userName">🌼&nbsp;&nbsp;{{isuser().name}}님 반갑습니다.&nbsp;🌼</v-flex>
    </v-layout>

    <!-- user info -->
    <v-layout class="my-10" row wrap>
      <v-flex class="my-5" xs12 sm6>
        <v-card style="width:90%; margin: 0 auto;">
          <v-card-title class="subheading font-weight-bold">회원 정보</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="subtitle-1 black--text">
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>이메일</td>
                    <td>{{isuser().email}}</td>
                  </tr>
                  <tr>
                    <td>이름</td>
                    <td>{{isuser().name}}</td>
                  </tr>
                  <tr>
                    <td>권한</td>
                    <td>{{isuser().auth}}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>

          <v-card-actions>
            <!-- User Information Edit -->
            <useredit />

            <!-- User Information Delete -->
            <v-btn @click="userOut()" min-width="80px">
              <span>회원 탈퇴</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <!-- User Payment History -->
      <v-flex class="my-5" xs12 sm6>
        <v-card style="width:90%; margin: 0 auto;">
          <v-card-title class="subheading font-weight-bold">결제 정보</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="subtitle-1 black--text">
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>결제 등급</td>
                    <td>{{userPaymentInfo.grade}}</td>
                  </tr>
                  <tr>
                    <td>결제일</td>
                    <td>{{userPaymentInfo.payment_date}}</td>
                  </tr>
                  <tr>
                    <td>만료일</td>
                    <td>{{userPaymentInfo.expire_date}}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-dialog v-model="dialog" width="1000">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" min-width="90px">
                  <span>결제</span>
                </v-btn>
              </template>
              <payment />
            </v-dialog>
            <v-btn min-width="80px">
              <span>결제내역</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <h3>{{isuser().name}}님의 요청 목록입니다.</h3>
    <!-- urlRequestList -->
    <OneUserRequest :email="isuser().email" />
  </v-container>
</template>

<script>
import Server from "../server.js"

export default {
  name: "MyPage",
  data: () => ({
    userInfo:{},
    userPaymentInfo:{},
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
    dialog:false
  }),
  created(){
    let formData = new FormData();
    formData.append("email", this.$store.getters.getUser.email);
    Server(this.$store.state.SERVER_URL).post("/post/getPayment", formData).then(result=>{
      if(result.data.length == 0) {
        this.userPaymentInfo = {
          grade: "Basic",
          payment_date: "결제 내역이 없습니다.",
          expire_date: ""
        }
      }
      else {
        this.userPaymentInfo = {
          grade: result.data[0].grade,
          payment_date: result.data[0].payment_date,
          expire_date: result.data[0].expire_date
        };
      }

    })

  },
  components :{
    useredit: ()=>import("@/components/UserEdit"),
    payment: () => import("@/components/Payment"),
    OneUserRequest : () => import("@/components/OneUserRequest"),
  },
  methods:{
    isuser(){
        return this.$store.getters.getUser
    },
    async userOut(){
      let userdata = {
        email : this.$store.getters.getUser.email
      }
      Server(this.$store.state.SERVER_URL).post("/post/deleteUser",userdata).then((res)=>{
        if(res.data.result == "true"){
          alert(res.data.message)
          this.$store.dispatch("isLog",true)
          this.$store.dispatch("logout")
          this.$router.push("/")
        }

      })
    },
    getColor(str){
      if(str=="false") return "red"
      else return "green"
    }
  }
}
</script>
<style scoped>
#userName {
  font-weight: bold;
  font-size: 2em;
}
</style>
