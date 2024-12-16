<template>
  <div>
    <!-- 뷰티파이 예시 -->
    <div>
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
    </div>

    <!-- 그리드 사용법 -->
    <div>
      <ag-grid-vue style="width: 500px; height: 500px;"
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :rowData="rowData">
      </ag-grid-vue>
    </div>
  </div>
</template>


  <script>
  //그리드 사용법
  import { AgGridVue } from "ag-grid-vue3";

  export default {
      name: 'App',
      data() {
          return {
              columnDefs: null,
              rowData: null
          }
      },
      components: {
          AgGridVue
      },
      beforeMount() {
          this.columnDefs = [
              { field: 'make' },
              { field: 'model' },
              { field: 'price' }
          ];

          this.rowData = [
              { make: 'Toyota', model: 'Celica', price: 35000 },
              { make: 'Ford', model: 'Mondeo', price: 32000 },
              { make: 'Porsche', model: 'Boxter', price: 72000 }
          ];
      }
  }
</script>
  
  <style lang="scss">
  
  /*
    그리드 사용시 아래 스타일 입포트 붙여넣기하면 됩니다 
    현재 vue파일 위치랑 실제 작업하는 vue파일이랑 차이가 있어 수정돼 있습니다 경로 확인해주세요
    @import "../../../node_modules/ag-grid-community/styles/ag-grid.css";
    @import "../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css";
  */

  @import "../../node_modules/ag-grid-community/styles/ag-grid.css";
  @import "../../node_modules/ag-grid-community/styles/ag-theme-alpine.css";

  //vuetify
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  </style>