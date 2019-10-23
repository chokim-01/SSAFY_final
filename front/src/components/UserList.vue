<template>
  <v-container>
    <v-data-table :headers="headers" :items="users">
      <template v-slot:item.email="{item}">
        <td @click="toUserRequest(item.email)">{{item.email}}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  props:{
      users:{
        type:Array
      }
  },
    data: () => ({
        headers:[
            {
                text:"email",
                value:"email"
            },
            {
                text:"user name",
                value:"user_name"
            },
            {
                text:"request count",
                value:"requestCount"
            }
        ]
    }),
    methods: {
  toUserRequest(email) {
    this.$router.push({ name: "UserRequest", params: { id : email } });
    }
  }
}
</script>
