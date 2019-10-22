<template>
  <v-container>
    <v-content>
      <v-layout row wrap>
        <!-- UserList Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getClick('userlist')">
            <widget
              icon="mdi-account"
              title="User List"
              subTitle="Total User Count"
              supTitle="123"
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
              subTitle="Today's Request Count"
              supTitle="123"
              color="#FFA000"
              unit="개"
            />
          </v-flex>
        </v-flex>

        <!-- Payment List Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getClick('paymentlist')">
            <widget
              icon="mdi-cash"
              title="Payment List"
              subTitle="Total Payment"
              supTitle="123"
              color="#27AE60"
              unit="개"
            />
          </v-flex>
        </v-flex>

        <!-- Pishing Site Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getClick('pishingsitelist')">
            <widget
              icon="mdi-view-list"
              title="Pishing Site"
              subTitle="Total Pishing Site List"
              supTitle="12356779"
              color="#FF0000"
              unit="개"
            />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-content>

    <!-- Data Table -->
    <!-- User List -->
    <!-- <v-layout v-show="widgetSelect==='userlist'">
      <UserList />
    </v-layout>-->

    <!-- Payment List -->
    <v-layout v-show="widgetSelect==='payment'">
      <PaymentList />
    </v-layout>

    <!-- Today Request List -->
    <v-layout v-show="widgetSelect==='todayrequest'">
      <TodayRequestList />
    </v-layout>

    <!-- Pishing Site List -->
    <v-layout v-show="widgetSelect==='pishing'">
      <PishingSiteList />
    </v-layout>
  </v-container>
</template>

<script>
export default{
    components :{
        // UserList : () => import('@/components/UserList'),
        TodayRequestList : () => import('@/components/TodayRequestList'),
        PaymentList : () => import('@/components/PaymentList'),
        PishingSiteList : () => import('@/components/PishingSiteList'),
        widget : () => import('@/components/Widget')
    },
    data: ()=> ({
      widgetSelect : "userlist"
    }),
    methods :{
        getClick(str){
            if(str=="userlist") this.widgetSelect="userlist"
            else if(str=="pishingsitelist") this.widgetSelect="pishing"
            else if(str=="paymentlist") this.widgetSelect="payment"
            else if(str=="todayrequest") this.widgetSelect="todayrequest"
        }
    }
}
</script>

<style scoped>
</style>
