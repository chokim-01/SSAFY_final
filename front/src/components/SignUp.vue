<template>
  <div justify-end>
    <v-dialog v-model="dialog" persistent max-width="500">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" color="green darken-1" text>Sign Up</v-btn>
      </template>

      <v-card>
        <v-card-title class="headline">
          <span>Sign Up Below</span>
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="name" type="text" label="Name" :rules="[rule.required]" required />

          <v-text-field
            label="Email"
            type="email"
            v-model="email"
            :rules="[rule.required, rule.email]"
            required
          />

          <v-text-field
            label="Password"
            type="password"
            v-model="password"
            :rules="[rule.required, rule.minLength(0), rule.maxLength(20)]"
            required
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="darken-1" text @click="clear()">
            <span>close</span>
          </v-btn>

          <v-btn color="darken-1" text @click="signUp()">
            <span>sign_up</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: "signUp",
  data () {
    return {
      dialog: false,
      name: "",
      email: "",
      password: "",
      rule: {
        required: v => !!v || "필수항목",
        email: v => /.+@.+/.test(v) || "이메일 형식입력",
        minLength: length => v => v.length >= length || `${length}자리 이상`,
        maxLength: length => v => v.length <= length || `${length}자리 이하`
      }
    }
  },
  methods: {
    signUp(){
      this.dialog = false
      let userdata = {
        userName : this.name,
        email : this.email,
        password : this.password
      }
      this.$http.post("/signUp",userdata).then((res)=>{
        // if(res.data.success == true){
        //   alert(res.data.message)
        //   this.$router.push("/signUp")
        // }
        // if(res.data.success == false){
        //   alert(res.data.message)
        // }
      })
    },
    clear () {
      this.name = ""
      this.email = ""
      this.password = ""
      this.dialog = false
    }
  }
}
</script>
