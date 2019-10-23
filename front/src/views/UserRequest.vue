<template>
  <v-layout>
    <v-container>
      <v-flex mb-10>
        <span>Email : {{email}}</span>
      </v-flex>
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
import axios from "axios";

export default {
  name : "UserRequest",
  data: () => ({
    email : "",
    selected: [],
    headers: [
      {
        text: 'Site Url',
        value: 'url',
      },
      {
        text:'Request date',
        value:'date'
      },
      {
        text:'Analysis',
        value:'analysis'
      },
      {
        text:'Result',
        value:'result'
      }
    ],
    userRequest: []
  }),
  created(){
    this.email = this.$route.params.id;
    this.getRequests();

  },
  methods:{
    getAnalysisColor (analysis) {
      if (analysis == "Complete") return "blue";
      else return "orange";
    },
    getResultColor (result) {
      if (result == "Phishing") return "red";
      else if(result == "no result") return "yellow";
      else return "green";
    },
    getRequests() {
      let formData = new FormData();
      formData.append("email", this.email);

      axios.post("http://localhost:5000/userRequest", formData).then(result=>{
        console.log(result.data);
        for(var idx = 0; idx < result.data.length; idx++) {
          if(result.data[idx][2]=="in progress") {
            this.userRequest.push({
              url: result.data[idx][0],
              date: result.data[idx][1],
              analysis: result.data[idx][2],
              result: "no result"
            })
          }
          else {
            this.userRequest.push({
              url: result.data[idx][0],
              date: result.data[idx][1],
              analysis: result.data[idx][2],
              result: result.data[idx][3]
            })
          }
        }
      })
    }
  }
}
</script>
