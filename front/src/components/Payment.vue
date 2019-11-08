<template>
  <v-container>
    <div>
      <v-card>
        <v-card-title class="headline grey lighten-2 justify-center" primary-title>
          <span>결제</span>
        </v-card-title>
        <v-row>
          <v-flex v-for="(item, i) in items" :index="i" :key="i">
            <v-col cols="12" align="center" justify="center">
              <v-hover v-slot:default="{ hover }">
                <v-card :elevation="hover ? 12 : 2" height="400" width="200">
                  <v-card-title class="title">
                    <span>{{item.name}}</span>
                    <span>{{item.month}}</span>
                  </v-card-title>
                  <v-img :src="getImg(item.step1)" max-width="40" max-height="40" class="row" />
                  <span>{{item.ex1}}</span>
                  <v-img :src="getImg(item.step2)" max-width="40" max-height="40" class="row" />
                  <span>{{item.ex2}}</span>
                  <v-img :src="getImg(item.step3)" max-width="40" max-height="40" class="row" />
                  <span>{{item.ex3}}</span>
                  <br />
                  <v-btn @click="pay(item.name,grade)" class="row">
                    <span>PAY</span>
                  </v-btn>
                </v-card>
              </v-hover>
            </v-col>
          </v-flex>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import Server from "../server.js"

export default {
    props:{
      grade:{
        type:String
      }
    },
    data () {
    return {
      price:0,
      items: [
        {
          name: "BASIC",
          step1: "detect.png",
          ex1:"탐지가능",
          step2: "noblock.png",
          ex2:"차단불가능",
          step3: "noalarm.png",
          ex3:"알람불가능",
        }
        ,
        {
          name: "PRO",
          month :"(30Day)",
          step1: "detect.png",
          ex1:"탐지가능",
          step2: "block.png",
          ex2:"차단가능",
          step3: "alarm.png",
          ex3:"알람가능"
        },
        {
          name: "PREMIUM",
          month:"(60Day)",
          step1: "detect.png",
          ex1:"탐지가능",
          step2: "block.png",
          ex2:"차단가능",
          step3: "alarm.png",
          ex3:"알람가능",
        }
      ]
    }
  },
    methods:{
    getImg (fileName) {
      return require("../assets/" + fileName)
    },
      async pay(grade,paygrade){
            let gradeWeight=0
            let payGradeWeight=0
            if(paygrade==="basic"){
              gradeWeight=0
            }
            else if(paygrade==="pro"){
              gradeWeight=1
            }
            else{
              gradeWeight=2
            }
            if(grade==="BASIC"){
              payGradeWeight=0
            }
            else if(grade==="PRO"){
              payGradeWeight=1
            }
            else{
              payGradeWeight=2
            }
            if(gradeWeight<payGradeWeight){
              let gradeForm = new FormData()
              gradeForm.append('grade',grade)

              // post price with gradeForm(grade)
              await Server(this.$store.state.SERVER_URL).post("/post/price",gradeForm).then(res=>{
                this.price=res.data[0].price
              })


              let form = new FormData()
              form.append('amount', this.price)
              form.append('grade',grade)

              // post pay with form(grand, price)
              Server(this.$store.state.SERVER_URL).post("/post/pay",form).then(res=>{
                  let payUrl = res.data.next_redirect_pc_url
                  let tid=res.data.tid
                  this.$store.dispatch("tid",tid)
                  this.$store.dispatch("total_amount",this.price)
                  location.href=payUrl
              })
            }
            else{
              alert("결제가 불가능 합니다")
            }
        }
    }
}
</script>

<style>
.box {
  text-align: center;
}
.row {
  margin-top: 20px;
}
</style>