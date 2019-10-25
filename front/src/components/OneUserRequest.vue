<template>
  <v-layout>
    <v-container>
      <!-- User Request URL -->
      <v-data-table :headers="headers" :items="userRequest">
        <template v-slot:item.analysis="{ item }">
          <v-chip :color="getAnalysisColor(item.analysis)" dark>{{ item.analysis }}</v-chip>
        </template>
        <template v-slot:item.result="{ item }">
          <v-chip :color="getResultColor(item.result)" dark>{{ item.result }}</v-chip>
        </template>
      </v-data-table>
    </v-container>
  </v-layout>
</template>

<script>
import Server from "../server.js"

export default {
  name : "UserRequest",
  props:{
    email:{
      type:String
    }
  },
  data: () => ({
    headers: [
      {
        text: "Site Url",
        value: "url",
      },
      {
        text: "Request date",
        value: "date"
      },
      {
        text: "Analysis",
        value: "analysis"
      },
      {
        text: "Result",
        value: "result"
      }
    ],
    userRequest: []
  }),
  created(){
    this.getRequests();
  },
  methods:{
    getAnalysisColor (analysis) {
      if (analysis == "Complete") {
        return "blue";
      }
      else {
        return "orange";
      }
    },
    getResultColor (result) {
      if (result == "Phishing") {
        return "red";
      }
      else if(result == "no result") {
        return "yellow";
      }
      else {
        return "green";
      }
    },
    getRequests() {
      let formData = new FormData();
      formData.append("email", this.email);

      Server(this.$store.state.SERVER_URL).post("/post/oneUserRequest", formData).then(result=>{
        for(var idx = 0; idx < result.data.length; idx++) {
          if(result.data[idx][2]=="in progress") {
            this.userRequest.push({
              url: result.data[idx].url,
              date: result.data[idx].request_date,
              analysis: result.data[idx].analysis,
              result: "no result"
            })
          }
          else {
            this.userRequest.push({
              url: result.data[idx].url,
              date: result.data[idx].request_date,
              analysis: result.data[idx].analysis,
              result: result.data[idx].result
            })
          }
        }
      })
    }
  }
}
</script>
