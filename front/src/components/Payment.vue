<template>
  <v-container>
    <div>
      <v-card>
        <v-card-title class="headline grey lighten-2 justify-center" primary-title>
          <span>결제</span>
        </v-card-title>
        <!-- Payment Grade List -->
        <v-layout>
          <!-- basic Grade -->
          <v-flex md4>
            <v-card>
              <v-card-title class="justify-center">
                <span>basic</span>
              </v-card-title>
              <v-card-text>
                <span>여기는 basic등급에 대한 내용</span>
              </v-card-text>
            </v-card>
          </v-flex>
          <!-- pro Grade -->
          <v-flex md4>
            <v-card>
              <v-card-title class="justify-center">
                <span>pro</span>
              </v-card-title>
              <v-card-text>
                <span>여기는 pro등급에 대한 내용</span>
              </v-card-text>
              <v-flex offset-xs2 offset-sm5>
                <v-btn>
                  <span @click="pay('pro')">결제</span>
                </v-btn>
              </v-flex>
            </v-card>
          </v-flex>
          <!-- premium Grade -->
          <v-flex md4>
            <v-card>
              <v-card-title class="justify-center">
                <span>premium</span>
              </v-card-title>
              <v-card-text>
                <span>여기는 premium등급에 대한 내용</span>
              </v-card-text>
              <v-flex offset-xs2 offset-sm5>
                <v-btn>
                  <span @click="pay('premium')">결제</span>
                </v-btn>
              </v-flex>
            </v-card>
          </v-flex>
        </v-layout>
        <v-divider />
      </v-card>
    </div>
  </v-container>
</template>

<script>
import Server from "../server.js"

export default {
    data: () => ({
      grade:"",
      price:0
    }),
    methods:{
      async pay(grade){
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
    }
}
</script>
