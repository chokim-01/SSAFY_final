<template>
  <v-container>
    <UserInfoUpdate />
  </v-container>
</template>

<script>
export default {
    name : "UserInfo",
    data: () => ({
    }),
    components:{
        UserInfoUpdate: () => import("@/components/UserInfoUpdate")
    }
}
</script>