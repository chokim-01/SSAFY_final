<template>
  <v-container>
    <v-content>
      <v-layout row wrap>
        <!-- UserList Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getClick('userlist'), getUserlist()">
            <widget
              icon="mdi-account"
              title="User List"
              widgetTitle="Total User Count"
              widgetValue="user"
              color="#1565C0"
              unit="명"
            />
          </v-flex>
        </v-flex>
        <!-- Today Request Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getClick('todayrequest')">
            <widget
              icon="mdi-calendar-blank"
              title="Today Request"
              widgetTitle="Today's Request Count"
              widgetValue="today"
              color="#FFA000"
              unit="개"
            />
          </v-flex>
        </v-flex>
        <!-- Payment List Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getClick('paymentlist'), getPaymentList()">
            <widget
              icon="mdi-cash"
              title="Payment List"
              widgetTitle="Total Payment"
              widgetValue="payment"
              color="#27AE60"
              unit="개"
            />
          </v-flex>
        </v-flex>
        <!-- Pishing Site Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getClick('pishingsitelist'), getPhishingSite()">
            <widget
              icon="mdi-view-list"
              title="Pishing Site"
              widgetTitle="Total Pishing Site List"
              widgetValue="phishing"
              color="#FF0000"
              unit="개"
            />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-content>
    <!-- Data Table -->
    <!-- Initial Page -->
    <v-layout v-show="widgetSelect==='default'">
      <div class="defaultBox">
        <h3>원하시는 메뉴를 선택해주세요.</h3>
      </div>
    </v-layout>
    <!-- User List -->
    <v-layout v-show="widgetSelect==='userlist'">
      <UserList :users="list" />
    </v-layout>
    <!-- Today Request List -->
    <v-layout v-show="widgetSelect==='todayrequest'">
      <TodayRequestList />
    </v-layout>
    <!-- Payment List -->
    <v-layout v-show="widgetSelect==='payment'">
      <PaymentList :paymentlist="list" />
    </v-layout>
    <!-- Pishing Site List -->
    <v-layout v-show="widgetSelect==='pishing'">
      <PishingSiteList :pishingsitelist="list" />
    </v-layout>
  </v-container>
</template>

<script>
import Server from "../server.js"

export default{
  components :{
    UserList : () => import("@/components/UserList"),
    TodayRequestList : () => import("@/components/TodayRequestList"),
    PaymentList : () => import("@/components/PaymentList"),
    PishingSiteList : () => import("@/components/PishingSiteList"),
    widget : () => import("@/components/Widget")
  },
  data: ()=> ({
    widgetSelect : "default",
    list :
    [{
      email:"",
      userName:"",
      requestCount:0
    }],
    userCount: "0",
    todayCount: "0",
    paymentCount: "0",
    phishingCount: "0",
    today: "2019-01-01"
  }),
  created() {
      Server(this.$store.state.SERVER_URL).get("/get/allCount").then(result=>{
      this.$store.state.userCount = result.data[0].userCount;
      this.$store.state.todayCount = result.data[0].todayCount;
      this.$store.state.paymentCount = result.data[0].paymentCount;
      this.$store.state.phishingCount = result.data[0].siteCount;
    })
  },
  methods :{
    getClick(str){
      if(str=="userlist") {
        this.widgetSelect="userlist"
      }
      else if(str=="pishingsitelist") {
        this.widgetSelect="pishing"
      }
      else if(str=="paymentlist") {
        this.widgetSelect="payment"
      }
      else if(str=="todayrequest") {
        this.widgetSelect="todayrequest"
      }
    },
    getUserlist(){
      Server(this.$store.state.SERVER_URL).get("/get/userList").then(result=>{
        this.list = []
        for(var idx = 0; idx < result.data.length; idx++) {
          this.list.push({
            user_name:result.data[idx].name,
            email: result.data[idx].email,
            requestCount: result.data[idx].requestCount
          })
        }
      })
    },
    getPaymentList() {
      Server(this.$store.state.SERVER_URL).get("/get/paymentList").then(result=>{
        this.list = []
        for(var idx = 0; idx < result.data.length; idx++) {
          this.list.push({
            email: result.data[idx].email,
            grade:result.data[idx].grade,
            payment_date: result.data[idx].payment_date,
            expire_date: result.data[idx].expire_date
          })
        }
      })
    },
    getPhishingSite() {
      Server(this.$store.state.SERVER_URL).get("/get/phishingList").then(result=>{
        this.list = []
        for(var idx = 0; idx < result.data.length; idx++) {
          this.list.push({ url: result.data[idx].url })
        }
      })
    }
  }
}
</script>

<style scoped>
.defaultBox {
  width: 100%;
  height: 400px;
  border: 2px dashed gray;
  line-height: 400px;
  text-align: center;
}
</style>
