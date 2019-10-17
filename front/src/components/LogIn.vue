<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">Log In</v-btn>
      </template>

      <v-card class="text-center">
        <v-card-title class="headline">
          <span>Log In Below</span>
        </v-card-title>

        <v-card-text>
          <v-flex xs12>
            <v-text-field v-model="email" label="Email*" required />
          </v-flex>

          <v-flex xs12>
            <v-text-field
              v-model="password"
              type="password"
              label="Password*"
              @keyup.enter="loginWithEmail"
              required
            />
          </v-flex>

          <v-flex xs12>
            <v-btn @click="loginWithEmail" rounded color="green" dark>
              <v-icon class="mr-2">mdi-email</v-icon>
              <span>email 로그인</span>
            </v-btn>
          </v-flex>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false" color="green darken-1" text>
            <span>close</span>
          </v-btn>

          <SignUp />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "logIn",
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

<style>
.headline {
  justify-content: center;
}
.emailbtn {
  color: green;
}
</style>