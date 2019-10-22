<template>
  <v-app-bar app>
    <v-toolbar-title class="headline text-uppercase" xs12>
      <router-link to="/" style="text-decoration:none; color: black;">Previewer</router-link>
    </v-toolbar-title>

    <v-spacer />

    <LogIn />
  </v-app-bar>
</template>

<script>
export default {
   name: "Header",
  components: {
    LogIn: () => import("./LogIn.vue"),
  },
  data: () => ({

  })
};
</script>
