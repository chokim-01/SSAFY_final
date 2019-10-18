<template>
  <v-container>
    <v-data-table :headers="headers" :items="userlist">
      <template v-slot:item.email="{item}">
        <td @click="toUserRequest(item.email)">{{item.email}}</td>
      </template>
    </v-data-table>
  </v-container>
</template>




<script>
export default {
    data: () => ({
        headers:[
            {
                text:'email',
                value:'email'
            },
            {
                text:'date',
                value:'date'
            },
            {
                text:'request',
                value:'requestCount'
            }
        ],
        userlist:[
            {
                email:"asdf@naver.com",
                date:"2019.10.11",
                requestCount:10
            }
        ]
    }),
    methods: {

  toUserRequest(email) {
    this.$router.push({ name: 'UserRequest', params: { id : email } });
  }

}
}
</script>