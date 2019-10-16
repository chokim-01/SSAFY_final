<template>
  <div justify-end>
    <v-dialog v-model="dialog" persistent max-width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="green darken-1" v-on="on" text>Sign Up</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Sign Up Below</v-card-title>
        <v-card-text>
          <v-text-field label="Name" type="text" :rules="[rule.required]" required v-model="name"></v-text-field>
          <v-text-field
            label="Email"
            type="email"
            required
            :rules="[rule.required, rule.email]"
            v-model="email"
          ></v-text-field>
          <v-text-field
            label="Password"
            type="password"
            required
            :rules="[rule.required, rule.minLength(0), rule.maxLength(20)]"
            v-model="password"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="clear()">close</v-btn>
          <v-btn color="darken-1" text @click="signUp()">sign_up</v-btn>
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
    
    clear () {
      this.name = ""
      this.email = ""
      this.password = ""
      this.dialog = false
    }
  }
}
</script>
