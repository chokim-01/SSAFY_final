<template>
  <v-container>
    <!-- Today Request List Data Table -->
    <v-data-table :headers="headers" :items="todayRequestList" />
  </v-container>
</template>

<script>
export default {
    props:{
      todayRequestList:{
        type:Array
      }
    },
    data: () => ({
        headers:[
            {
                text:"name",
                value:"username"
            },
            {
                text:"url",
                value:"requestUrl"
            },
            {
                text:"admission",
                value:"admission"
            }
        ]
    })
}
</script>
