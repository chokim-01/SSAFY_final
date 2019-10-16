<template>
  <v-app-bar app>
    <v-toolbar-title class="headline text-uppercase" xs12>
      <span>Previewer</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
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
