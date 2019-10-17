<template>
  <v-container>
    <!-- Pishing Site List Data Table-->
    <v-data-table :headers="headers" :items="pishingsitelist" />
  </v-container>
</template>

<script>
export default {
    data: () => ({
        headers:[
            {
                text:"url",
                value:"url"
            },
            {
                text:"result",
                value:"result"
            }
        ],
        pishingsitelist:[
            {
                url:"https://google.com",
                result:"true"
            }
        ]
    })
}
</script>