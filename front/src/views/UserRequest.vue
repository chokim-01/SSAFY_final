<template>
  <v-layout>
    <v-container>
      <v-flex mb-10>
        <span>Email : {{email}}</span>
      </v-flex>
      <!-- User Request URL -->
      <v-data-table :headers="headers" :items="userRequest">
        <template v-slot:item.request="{item}">
          <v-chip :color="getColor(item.request)" dark>{{item.request}}</v-chip>
        </template>
      </v-data-table>
    </v-container>
  </v-layout>
</template>
<script>
export default {
  name : "UserRequest",
    data: () => ({
      email : "",
      selected: [],
      headers: [
        {
          text: 'SiteAddress',
          value: 'siteAddress',
        },
        {
          text:'Request',
          value:'request'
          }
        ],
        userRequest:[
          {
            siteAddress : "https://edu.ssafy.com",
            request : "Approve"
          },
          {
            siteAddress : "https://ssafy.com",
            request : "Reject"

          }
        ]
    }),
    mounted(){
      this.email = this.$route.params.id
    },
    methods:{
          getColor(str){
              if(str=="Reject") return 'red'
              else return 'green'
          }
      }
    
}
</script>