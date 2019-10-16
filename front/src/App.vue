<template>
  <v-app>
    <Header />
    <v-content>
      <router-view />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
    Header :()=> import("@/components/Header"),
    Footer:()=> import("@/components/Footer")
  },
  data: () => ({
    //
  }),
};
</script>
