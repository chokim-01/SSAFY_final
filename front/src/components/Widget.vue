<template>
  <div class="widget-card pa-1 mb-3" :style="{ borderColor: color}">
      <v-container class="pa-0">
        <div class="layout row ma-0" >
          <div class="sm3 xs3 flex marginright">
            <!-- Widget Icon -->
            <div class="layout column ma-0 justify-center align-center">
              <v-icon size="50px" :style="{ color: color}" style="opacity: 0.8; margin-top: 5px">{{icon}}</v-icon>
            </div>
          </div>

          <!-- Title / SupTitle -->
          <div class="layout column ma-0">
            <span class="caption">{{ title }}</span>
            <div class="headline font-weight-bold iCountUp" :style="{ color: color}">
              <ICountUp
              :delay="delay"
              :endVal="setEndValue"
              :options="options"
              id="countUpId"
              />
              {{ unit }}
            </div>
          </div>
        </div>
      </v-container>
  </div>
</template>

<script>
import ICountUp from 'vue-countup-v2';

export default {
  components: {
    ICountUp
  },
  props: {
    supTitle: {
      type: String,
      required: false
    },
    subTitle: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    icon: {
      type: String,
      required: false
    },
    color: {
      type: String,
      required: false
    },
    unit: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      delay: 1000,
      options: {
        useEasing: false,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
      }
    }
  },
  created() {
  },
  computed: {
    setEndValue() {
      let count = 0;
      if(this.supTitle == "user") {
        count = this.$store.state.userCount;
      }
      else if(this.supTitle == "today") {
        count = this.$store.state.todayCount;
      }
      else if(this.supTitle == "payment") {
        count = this.$store.state.paymentCount;
      }
      else {
        count = this.$store.state.phishingCount;
      }
      return count;
    }
  },
  methods: {
  }
}
</script>

<style>
.widget-card {
  border-radius: 10px ;
  border: 2px dashed;
  margin-right: 1.5em;
  margin-left: 1.5em;
}
.marginright {
  margin-right: 1em;
}
</style>
