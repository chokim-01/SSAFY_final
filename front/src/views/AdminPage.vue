<template>
  <v-container>
    <v-content>
      <v-layout row wrap>
        <!-- UserList Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getclick('userlist')">
            <widget
              icon="mdi-account"
              title="User List"
              subTitle="Total User Count"
              supTitle="123 명"
              color="#00b297"
            />
          </v-flex>
        </v-flex>

        <!-- Today Request Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getclick('todayrequest')">
            <widget
              icon="mdi-calendar-blank"
              title="Today Request"
              subTitle="Today's Request Count"
              supTitle="123 개"
              color="#dc3545"
            />
          </v-flex>
        </v-flex>

        <!-- Payment List Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getclick('paymentlist')">
            <widget
              icon="mdi-cash"
              title="Payment List"
              subTitle="Total Payment"
              supTitle="123 개"
              color="#0866C6"
            />
          </v-flex>
        </v-flex>

        <!-- Pishing Site Widget -->
        <v-flex d-flex lg3 sm6 xs12>
          <v-flex @click="getclick('pishingsitelist')">
            <widget
              icon="mdi-view-list"
              title="Pishing Site"
              subTitle="Total Pishing Site List"
              supTitle="123 개"
              color="#1D2939"
            />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-content>

    <!-- Data Table -->
    <!-- User List -->
    <v-layout>
      <UserList />
    </v-layout>

    <!-- Payment List -->
    <v-layout>
      <PaymentList />
    </v-layout>

    <!-- Today Request List -->
    <v-layout>
      <TodayRequestList />
    </v-layout>

    <!-- Pishing Site List -->
    <v-layout>
      <PishingSiteList />
    </v-layout>
  </v-container>
</template>

<script>
export default{
    components :{
        UserList : () => import('@/components/UserList'),
        TodayRequestList : () => import('@/components/TodayRequestList'),
        PaymentList : () => import('@/components/PaymentList'),
        PishingSiteList : () => import('@/components/PishingSiteList'),
        widget : () => import('@/components/Widget')
    },
    data: ()=> ({
    })
}
</script>

<style scoped>
</style>