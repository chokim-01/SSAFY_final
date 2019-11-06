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
          <v-divider></v-divider>
          <v-card-actions class="d-flex flex-row-reverse">
            <!-- User Information Delete -->
            <v-btn @click="userOut()" min-width="90px">
              <span class="red--text">회원 탈퇴</span>
            </v-btn>
            <!-- User Information Edit -->
            <useredit />
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
          <v-divider></v-divider>
          <v-card-actions class="d-flex flex-row-reverse">
            <v-dialog v-model="history" scrollable max-width="700px">
              <template v-slot:activator="{ on }">
                <v-btn @click="getHistory()" min-width="90px" v-on="on">
                  <span>결제 내역</span>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <v-layout>
                    <v-flex>💲{{isuser().name}}님의 결제 내역💲</v-flex>
                    <v-flex class="justify-end">
                      <v-btn @click="history = false" text style="float: right">
                        <v-icon>mdi mdi-close</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text id="historyTable" class="pt-5" style="height: 300px;">
                  <v-data-table
                    :headers="historyHeader"
                    :items="paymentHistory"
                    class="elevation-1"
                    hide-default-footer
                  ></v-data-table>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="d-flex justify-end px-5">
                  <span>총 결제 금액 : {{totalPrice}}원</span>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialog" width="1000">
              <template v-slot:activator="{ on }">
                <v-btn class="mx-10" v-on="on" min-width="90px">
                  <span>결제하기</span>
                </v-btn>
              </template>
              <payment :grade="userPaymentInfo.grade" />
            </v-dialog>
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
    dialog: false,
    history: false,
    totalPrice: 0,
    paymentHistory: [],
    paymentGrade:"",
    historyHeader: [
      {
          text:"grade",
          value:"grade"
      },
      {
        text:"payment date",
        value: "payment_date"
      },
      {
        text: "expire date",
        value: "expire_date"
      }
    ]
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
        if(res.data.message.length>0){
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
    },
    getHistory() {
      Server(this.$store.state.SERVER_URL).post("/post/getPaymentGrade").then(gradeResults=>{
        let formData = new FormData();
        formData.append("email", this.$store.getters.getUser.email);
        Server(this.$store.state.SERVER_URL).post("/post/getPaymentHistory", formData).then(result=>{
          this.paymentHistory = [];
          this.totalPrice = 0;
          for(let idx in result.data){
            this.paymentHistory.push({
              grade: result.data[idx].grade,
              payment_date: result.data[idx].payment_date,
              expire_date: result.data[idx].expire_date
            });

            for(let gradeIdx in gradeResults.data) {
              if(result.data[idx].grade == gradeResults.data[gradeIdx].grade){
                this.totalPrice += gradeResults.data[gradeIdx].price;
              }
            }
          }
        })
      })
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

<style>
#historyTable tbody > tr:nth-child(1) {
  background-color: #ceecf5;
}
</style>
