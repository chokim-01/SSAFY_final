<template>
  <v-container>
    <!-- Pishing Site List Data Table-->
    <v-data-table :headers="headers" :items="pishingsitelist" />
  </v-container>
</template>

<script>
export default {
  props:{
    pishingsitelist:{
      type:Array
    }
  },
  data: () => ({
    headers:[
      {
        text: "url",
        value: "url"
      }
    ]
  })
}
</script>
