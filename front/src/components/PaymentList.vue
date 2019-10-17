<template>
  <v-container>
    <!-- PaymentList Data Table -->
    <v-data-table :headers="headers" :items="paymentlist" />
  </v-container>
</template>

<script>
export default {
    data: () => ({
        headers:[
            {
                text:"name",
                value:"username"
            },
            {
                text:"grade",
                value:"paymentgrade"
            },
            {
                text:"date",
                value:"paymentdate"
            }
        ],
        //test data
        paymentlist:[
            {
                username:"홍길동",
                paymentgrade:"pro",
                paymentdate:"2019.10.11"
            }
        ]
    })
}
</script>