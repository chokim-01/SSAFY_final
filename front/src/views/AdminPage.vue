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
              subTitle="Total User Count"
              supTitle="user"
              color="#1565C0"
              unit="명"
            />
          </v-flex>
        </v-flex>

        <!-- Today Request Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getClick('todayrequest'), getTodayRequest()">
            <widget
              icon="mdi-calendar-blank"
              title="Today Request"
              subTitle="Today's Request Count"
              supTitle="today"
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
              subTitle="Total Payment"
              supTitle="payment"
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
              subTitle="Total Pishing Site List"
              supTitle="phishing"
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
      <TodayRequestList :todayRequestList="list" />
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
import axios from "axios";

export default{
    components :{
        UserList : () => import('@/components/UserList'),
        TodayRequestList : () => import('@/components/TodayRequestList'),
        PaymentList : () => import('@/components/PaymentList'),
        PishingSiteList : () => import('@/components/PishingSiteList'),
        widget : () => import('@/components/Widget')
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
      let date = new Date();
      let year = date.getFullYear();
      let month = new String(date.getMonth()+1);
      let day = new String(date.getDate());

      if(month.length == 1){
        month = "0" + month;
      }
      if(day.length == 1){
        day = "0" + day;
      }

      this.today = year+"-"+month+"-"+day;

      let formData = new FormData();
      formData.append("today", this.today);

      axios.post("http://localhost:5000/countList", formData).then(result=>{
        this.$store.state.userCount = result.data[0][0];
        this.$store.state.todayCount = result.data[0][1];
        this.$store.state.paymentCount = result.data[0][2];
        this.$store.state.phishingCount = result.data[0][3];
      })
    },
    methods :{
        getClick(str){
            if(str=="userlist") this.widgetSelect="userlist"
            else if(str=="pishingsitelist") this.widgetSelect="pishing"
            else if(str=="paymentlist") this.widgetSelect="payment"
            else if(str=="todayrequest") this.widgetSelect="todayrequest"
        },
        getUserlist(){
          axios.post("http://localhost:5000/userlist").then(result=>{
            this.list = []
            for(var idx = 0; idx < result.data.length; idx++) {
              this.list.push({email: result.data[idx][0], user_name:result.data[idx][1], requestCount: result.data[idx][3]})
            }
          })
        },
        getTodayRequest() {
          let formData = new FormData();
          formData.append("today", this.today);

          axios.post("http://localhost:5000/todayRequest", formData).then(result=>{
            this.list = []
            for(var idx = 0; idx < result.data.length; idx++) {
              this.list.push({username: result.data[idx][0], requestUrl:result.data[idx][1], admission: "true"})
            }

            // **** admission 인증
          })
        },
        getPaymentList() {
          axios.post("http://localhost:5000/paymentList").then(result=>{
            this.list = []
            for(var idx = 0; idx < result.data.length; idx++) {
              this.list.push({email: result.data[idx][0], grade:result.data[idx][1], pay_date: result.data[idx][2], expire_date: result.data[idx][3]})
            }
          })
        },
        getPhishingSite() {
          axios.post("http://localhost:5000/phishingList").then(result=>{
            this.list = []
            for(var idx = 0; idx < result.data.length; idx++) {
              if(result.data[idx][1]=="in progress") {
                this.list.push({url: result.data[idx][0], analysis:result.data[idx][1], result: "no result"})
              }
              else {
                this.list.push({url: result.data[idx][0], analysis:result.data[idx][1], result: result.data[idx][2]})
              }
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
  line-height:400px;
  text-align:center;
}

</style>
