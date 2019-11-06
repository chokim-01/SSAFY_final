<template>
  <v-layout>
    <v-container>
      <!-- User Request URL -->
      <v-data-table :headers="headers" :items="userRequest">
        <template v-slot:item.result="{ item }">
          <v-chip :color="getResultColor(item.result)">
            {{ analysisResult(item.result) }}
          </v-chip>
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
        text: "Analysis Result",
        value: "result"
      }
    ],
    userRequest: []
  }),
  created(){
    this.getRequests();
  },
  methods:{
    getResultColor (result) {
      if (result == 1) {
        return "#F78181";
      }
      else {
        return "#BEF781";
      }
    },
    getRequests() {
      let formData = new FormData();
      formData.append("email", this.email);

      Server(this.$store.state.SERVER_URL).post("/post/oneUserRequest", formData).then(result=>{
        for(var idx = 0; idx < result.data.length; idx++) {
          this.userRequest.push({
            url: result.data[idx].url,
            date: result.data[idx].request_date,
            result: result.data[idx].result
          })
        }
      })
    },
    analysisResult(result) {
      if(result==1) return "Valid Phishing"
      else return "Invalid Phishing"
    }
  }
}
</script>
