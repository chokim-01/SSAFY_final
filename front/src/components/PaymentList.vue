<template>
  <v-container>
    <!-- PaymentList Data Table -->
    <v-data-table :headers="headers" :items="paymentlist" />
  </v-container>
</template>

<script>
export default {
  props:{
    paymentlist:{
      type:Array
    }
  },
  data: () => ({
    headers:[
      {
        text: "email",
        value: "email"
      },
      {
        text: "grade",
        value: "grade"
      },
      {
        text: "payment_date",
        value: "payment_date"
      },
      {
        text: "expire_date",
        value: "expire_date"
      }
    ]
  })
}
</script>
