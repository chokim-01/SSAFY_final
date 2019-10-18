<template>
  <v-container>
    <!-- Today Request List Data Table -->
    <v-data-table :headers="headers" :items="todayRequestList"></v-data-table>
  </v-container>
</template>

<script>
export default {
    data: () => ({
        headers:[
            {
                text:'name',
                value:'username'
            },
            {
                text:'url',
                value:'requestUrl'
            },
            {
                text:'admission',
                value:'admission'
            }
        ],
        todayRequestList:[
            {
                username:"홍길동",
                requestUrl:"https://www.naver.com",
                admission:"true"
            }
        ]
    })
}
</script>