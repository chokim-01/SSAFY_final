

<template>
  <v-container>
    <!-- Today Request List Data Table -->
    <v-data-table :headers="headers" :items="TodayRequest">
      <template v-slot:item.analysisResult="{item}">
        <!-- AnalysisResult Change -->
        <v-chip
          @click="changeResult(item.email,item.requestUrl)"
          :color="getResultColor(item.analysisResult)"
        >{{analysisResult(item.analysisResult)}}</v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>


<script>
import Server from "../server.js"


export default {
    data: () => ({
        headers:[
            {
                text:"email",
                value:"email"
            },
            {
                text:"url",
                value:"requestUrl"
            },
            {
                text:"analysisResult",
                value:"analysisResult"
            }
        ],
        TodayRequest:[]
    }),
    created(){
      Server(this.$store.state.SERVER_URL).get("/get/todayRequest").then(result=>{
            this.TodayRequest = []
            for(var idx = 0; idx < result.data.length; idx++) {
              this.TodayRequest.push({
                email: result.data[idx].email,
                requestUrl:result.data[idx].url,
                analysisResult: result.data[idx].analysisResult
              })
            }
          })
    },
    methods:{
      changeResult(email,url){
        let formData=new FormData()
        formData.append("email",email)
        formData.append("url",url)
        Server(this.$store.state.SERVER_URL).post("/post/changeAnalysisResult", formData).then(result=>{
          Server(this.$store.state.SERVER_URL).get("/get/todayRequest").then(result=>{
            this.TodayRequest = []
            for(var idx = 0; idx < result.data.length; idx++) {
              this.TodayRequest.push({
                email: result.data[idx].email,
                requestUrl:result.data[idx].url,
                analysisResult: result.data[idx].analysisResult
              })
            }
          })
        })
      },
      getResultColor (result) {
        if (result == 1) {
          return "#F78181";
        }
        else {
          return "#BEF781";
        }
      },
      analysisResult(result){
        if(result==1) return "Valid Phishing"
        else return "Invalid Phishing"
      }
    }
}
</script>
