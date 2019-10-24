<template>
  <v-container>
    <!-- Pishing Site List Data Table-->
    <v-data-table :headers="headers" :items="pishingsitelist">
      <template v-slot:item.analysis="{ item }">
        <v-chip :color="getAnalysisColor(item.analysis)" dark>
          {{ item.analysis }}
        </v-chip>
      </template>
      <template v-slot:item.result="{ item }">
        <v-chip :color="getResultColor(item.result)" dark>
          {{ item.result }}
        </v-chip>
      </template>
    </v-data-table>
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
      },
      {
        text: "analysis",
        value: "analysis"
      },
      {
        text: "result",
        value: "result"
      }
    ]
  }),
  methods: {
    getAnalysisColor (analysis) {
      if (analysis == "Complete") return "blue";
      else return "orange";
    },
    getResultColor (result) {
      if (result == "Phishing") return "red";
      else if(result == "no result") return "yellow";
      else return "green";
    }
  }
}
</script>
