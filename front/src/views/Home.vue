<template>
  <div class="home">
    <v-layout class="mainPage mb-12" row wrap>
      <v-flex class="my-10 projectName" xs12>
        <div>🚥PREVIEWER</div>
      </v-flex>
      <v-flex class="px-10 introTitle" xs12>previewer는 인터넷 사용시 발생할 수 있는 위협을 탐지 및 차단하는 서비스 입니다.</v-flex>
      <v-flex class="px-10" xs12>
        <p class="introText">
          ❤️ previewer는 피싱 사이트, Cross Site Script를 탐지하고 차단합니다.
          <br />💛 previewer는 로그인 시 평문으로 전송되는지 탐지하고 차단합니다.
          <br />💚 previewer는 HTTP, HTTPS, HSTS 를 탐지합니다.
          <br />
        </p>
      </v-flex>
      <v-flex xs12>
        <v-btn
          class="my-12"
          text
          x-large
          href="https://drive.google.com/file/d/13CSY1PZGUQD0FtCyhPWbU_1ul89043gw/view"
        >
          <span class="moveButton">
            확장 프로그램 다운로드하러 가기
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
            크롬 확장 프로그램 다운로드하기
          </div>
          <v-img src="@/assets/step1.png" class="ma-7 stepImage" />
        </v-flex>
        <v-flex xs12 md6 lg4>
          <div>
            <span class="step" style="color: orange;">
              STEP
              <v-icon class="mdi mdi-numeric-2-box-outline" color="orange" large />
            </span>
            회원 설정하기
          </div>
          <v-img src="@/assets/step2.png" class="ma-7 stepImage" />
        </v-flex>
        <v-flex xs12 md6 lg4>
          <div>
            <span class="step" style="color: green;">
              STEP
              <v-icon class="mdi mdi-numeric-3-box-outline" color="green" large />
            </span>
            사용하기
          </div>
          <v-img src="@/assets/step3.png" class="ma-7 stepImage" />
        </v-flex>
      </v-layout>
      <v-layout class="my-12 pa-10" row wrap>
        <v-flex xs12 sm6>
          <h2>"PREVIEWER"는 스마트하게 알려드립니다.</h2>
          <br />
          <br />피싱사이트 이동시 실시간으로다가 이렇게 잘 알려드리겠슴다.
        </v-flex>
        <v-flex xs12 sm6>
          <v-img src="../assets/main.png" style="width:530px; height: 400px;" />
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
  methods: {}
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap");

.mainPage {
  height: 95vh;
  background-image: url("https://image.freepik.com/free-vector/_1055-3147.jpg");
  background-size: cover;
  font-family: "Noto Sans KR", sans-serif;
  text-align: center;
  color: black;
}

.projectName {
  font-size: 60px;
}

.introTitle {
  font-size: 30px;
  font-weight: bold;
}

.introText {
  text-align: left;
  margin: 0 auto;
  width: fit-content;
  font-size: 24px;
}

.moveButton {
  color: green;
  font-size: 27px;
}

.step {
  font-size: 25px;
  padding-left: 30px;
}

.stepImage {
  width: 300px;
  height: 300px;
}

@media screen and (max-width: 768px) {
  .projectName {
    font-size: 40px;
  }
  .introTitle {
    font-size: 24px;
  }
  .introText {
    font-size: 15px;
  }
}
</style>
