<template>
  <v-container>
    <div>
      <v-card>
        <v-card-title class="headline grey lighten-2 justify-center" primary-title>
          <span>결제</span>
        </v-card-title>
        <!-- Payment Grade List -->
        <v-layout>
          <!-- basic Grade -->
          <v-flex md4>
            <v-card>
              <v-card-title class="justify-center">
                <span>basic</span>
              </v-card-title>
              <v-card-text>
                <span>여기는 basic등급에 대한 내용</span>
              </v-card-text>
              <v-flex offset-xs2 offset-sm5>
                <v-btn>
                  <span>결제</span>
                </v-btn>
              </v-flex>
            </v-card>
          </v-flex>
          <!-- pro Grade -->
          <v-flex md4>
            <v-card>
              <v-card-title class="justify-center">
                <span>pro</span>
              </v-card-title>
              <v-card-text>
                <span>여기는 pro등급에 대한 내용</span>
              </v-card-text>
              <v-flex offset-xs2 offset-sm5>
                <v-btn>
                  <span>결제</span>
                </v-btn>
              </v-flex>
            </v-card>
          </v-flex>
          <!-- premium Grade -->
          <v-flex md4>
            <v-card>
              <v-card-title class="justify-center">
                <span>premium</span>
              </v-card-title>
              <v-card-text>
                <span>여기는 premium등급에 대한 내용</span>
              </v-card-text>
              <v-flex offset-xs2 offset-sm5>
                <v-btn>
                  <span>결제</span>
                </v-btn>
              </v-flex>
            </v-card>
          </v-flex>
        </v-layout>
        <v-divider />
      </v-card>
    </div>
  </v-container>
</template>

<script>
export default {
    data: () => ({

    })
}
</script>
