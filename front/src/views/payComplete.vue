<template>
  <div></div>
</template>

<script>
import Server from "../server.js"

export default {
    name:"PayComplete",
    data:()=>({
      pg_token:"",
      tid:"",
      total_amount:0,
      grade:"",
      method:"",
      time:""
    }),
    async created(){
      // get pg_token from url
      let uri=window.location.search.substring(1)
      let params=new URLSearchParams(uri)
      
      this.pg_token=params.get("pg_token")
      this.tid=this.$store.getters.getTid
      this.total_amount=this.$store.getters.getTotalAmount

      let form=new FormData()
      form.append("pg_token",this.pg_token)
      form.append("tid",this.tid)
      form.append("total_amount",this.total_amount)

      // posts paycomlete with form(pg_token, tid, total_amount)
      await Server(this.$store.state.SERVER_URL).post("/post/payComplete",form).then(res=>{
        form.append("approved_time",res.data.approved_at)
        form.append("grade",res.data.item_name)
        form.append("email",this.$store.getters.getUser.email)

        // post add Pay with form(approved_time, grade, email)
        Server(this.$store.state.SERVER_URL).post("/post/addPay",form).then(res=>{
          location.href="/mypage"
          alert("결제완료")
        })
      })
    }
}
</script>