<template>
  <v-card
    class="mx-auto"
    prepend-icon="$vuetify"
    subtitle="끝까지 파이팅!"
    width="500"
  >
    <template v-slot:title>
      <span class="font-weight-black">FLASHLIGHT 프로젝트</span>
    </template>

    <v-card-text class="bg-surface-light pt-4">
      로그인 후 화면에 출력되는 메인페이지는 <br>
      로그인 정보별로 달라져야하기 때문에 현재는 구현할 수 없습니다. <br>
      ex) http://localhost:0000/business 과 같은 방식으로 이동해주세요
    </v-card-text>
  </v-card>
</template>

  
  <script>
    export default {
      components: {
  
      }
    }
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  </style>
  