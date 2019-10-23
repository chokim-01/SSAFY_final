<template>
  <div class="home">
    <v-layout class="mainPage mb-12" row wrap style="text-align: center; color: black;">
      <v-flex class="my-10" xs12>
        <div style="font-size:60px; ">🚥PREVIEWER</div>
      </v-flex>
      <v-flex class="px-10" xs12>
        <h3>
          previewer는 가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라 서비스입니다.
        </h3>
      </v-flex>
      <v-flex class="px-10" xs12>
        <p>
          ❤️ previewer는 가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라 서비스입니다.<br />
          💛 previewer는 가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라 서비스입니다.<br />
          💚 previewer는 가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라가나다라 서비스입니다.<br />
        </p>
      </v-flex>
      <v-flex xs12>
        <v-btn class="my-12" text x-large>
          <span style="color: green; font-size:27px;">
            확장 프로그램 추가하러 가기
            <v-icon large>mdi mdi-share</v-icon>
          </span>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-container>
      <h1>How to use?</h1>
      <v-layout class="my-10" row wrap>
        <v-flex xs12 md6 lg4>
          <div>
            <span class="step" style="color: red;">
             STEP
             <v-icon class="mdi mdi-numeric-1-box-outline" color="red" large />
            </span>
             크롬 확장 프로그램 추가
          </div>
          <v-img src="../assets/preview.png" class="ma-7 stepImage"/>
        </v-flex>
        <v-flex xs12 md6 lg4>
          <div>
            <span class="step" style="color: orange;">
             STEP
             <v-icon class="mdi mdi-numeric-2-box-outline" color="orange" large />
            </span>
            회원 설정하기
          </div>
          <v-img src="../assets/preview.png" class="ma-7 stepImage"/>
        </v-flex>
        <v-flex xs12 md6 lg4>
          <div>
            <span class="step" style="color: green;">
             STEP
             <v-icon class="mdi mdi-numeric-3-box-outline" color="green" large />
            </span>
            사용하기
          </div>
          <v-img src="../assets/preview.png" class="ma-7 stepImage"/>
        </v-flex>
      </v-layout>
      <v-layout class="my-12 pa-10" row wrap>
        <v-flex  xs12 sm6>
          <h2>"PREVIEWER"는 스마트하게 알려드립니다.</h2>
          <br><br>

          피싱사이트 이동시 실시간으로다가 이렇게 잘 알려드리겠슴다.
        </v-flex>
        <v-flex xs12 sm6>
          <v-img src="../assets/preview.png" style="width:530px; height: 400px;"/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  components: {},
  methods: {

  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Do+Hyeon&display=swap');

.mainPage {
  height:95vh;
  background-image: url("https://image.freepik.com/free-vector/_1055-3147.jpg");
  background-size: cover;
  font-family: 'Do Hyeon', sans-serif;
}

.step {
  font-size:25px;
  padding-left:30px;
}

.stepImage {
  width:300px;
  height: 300px;
}
</style>
