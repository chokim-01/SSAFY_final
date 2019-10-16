<template>
  <v-container>
    <MyRequestList />
  </v-container>
</template>

<script>
export default {
    name : "MyPage",
    data: () => ({
        
    }),
    components:{
        MyRequestList: () => import("@/components/MyRequestList")
    }
}
</script>