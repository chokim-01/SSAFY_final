<template>
  <div align-center justify-end>
    <v-dialog v-model="dialog" persistent max-width="500">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">Log In</v-btn>
      </template>
      <v-card max-width="496" class="text-center">
        <v-card-title class="headline">Log In Below</v-card-title>
        <v-card-text>
          <v-flex xs12>
            <v-text-field label="Email*" required v-model="email"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Password*"
              type="password"
              required
              v-model="password"
              @keyup.enter="loginWithEmail"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-btn rounded color="green" dark @click="loginWithEmail">
              <v-icon size="25" class="mr-2">mdi-email</v-icon>email 로그인
            </v-btn>
          </v-flex>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">close</v-btn>
          <SignUp />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: "LogIn",
      components: {
        SignUp: () => import("./SignUp.vue"),
      },
  data () {
    return {
      email:"",
      password:"",
      dialog:false
     
    }
  },
   async loginWithEmail () {
     this.dialog = false

    }

  
}
</script>
