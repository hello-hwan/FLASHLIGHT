<template>
  <span style="margin-left:20px">
      <button type="button" class="kiosk-btn back-green display-6 font-weight-black" @click="modalOpen">공정이동표</button>
      <!-- 모달창 열기 -->
      <div class="modal-wrap" @click="modalOpen" v-show="modalCheck">
        <div class="modal-container" @click.stop="">
          <div id="search-bar">
            <div>
              <AgGridVue style=" height: 700px; margin: 0 auto;"
                  :defaultColDef="defaultColDef"
                  :rowData="rowData"
                  :gridOptions="gridOptions"
                  class="ag-theme-alpine">
              </AgGridVue>
            </div>
            <div class="modal-btn">
              <button @click="modalOpen"class="kiosk-btn back-red display-6 font-weight-black">닫기</button>
            </div>
          </div>
        </div>
      </div>
  </span>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { ref, defineProps  } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons';
import useDates from "@/utils/useDates";

// 받아와야하는 값 정의
const props = defineProps(["prd", "order"]);

// 행 정보
const rowData = ref([]);

// 컬럼명 정의
// field : 배열안 객체의 필드명, headerName : 우리가 표시할 컬럼 이름, flex: 열 크기, hide: 숨길건지(검색시 필요할수도 있으니 표시할거만 표시), suppressToolPanel: hide 쓰면 같이 써야하는거
const ColDefs = [
  { field: "procs_nm", headerName:"공정명", flex:1.5},
  { field: "prdctn_co", headerName:"생산량"},
  { field: "empl_nm", headerName:"작업자"},
  { field: "end_time", headerName:"종료일자", flex:2},
];

// 정보 담을 함수
const getlist = async (prd, order) => {
  let result = await axios.get(`${ajaxUrl}/prod/shiftlist`, { params : { "prd_code" : prd, "order_no" : order} })
  .catch(err => console.log(err));
  for(let i = 0; i < result.data.length; i++){
    let date = result.data[i].end_time;
    let day_str = useDates.dateFormat(date, 'yyyy-MM-dd') + ' ' + useDates.timeFormat(date, 'hh:mm:ss');
    result.data[i].end_time = day_str;
  }
  rowData.value = result.data;
};

//ag grid 옵션 설정
const gridOptions = {
  columnDefs: ColDefs,
  animateRows: false,
  defaultColDef: {
    flex: 1,
    minWidth: 10
  },
  rowHeight: 80,
  headerHeight: 100,
};

//모달 열림 상태 담을 변수
let modalCheck = ref(false);

//모달이 열리면 true로 변경, 스크롤 막기
const modalOpen = () => {
  const html = document.querySelector('html');
  if(modalCheck.value == false) {
    modalCheck.value = !modalCheck.value;
    html.style.overflow = 'hidden';
    getlist(props.prd, props.order);
  } else {
    modalCheck.value = !modalCheck.value;
    html.style.overflow = 'auto';
  }
};


</script>

<style scoped>
/* dimmed */
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 3;
}
/* modal or popup */
.modal-container {
  position: relative;
  top: 53%;
  left: 61%;
  transform: translate(-50%, -50%);
  width: 80%;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}

.modal-btn button {
  line-height: 1.1;
  margin: 10px 0;
}
.align-left{
  margin: 10px 0;
}
.align-left>span {
  margin-left: 20px;
}
.search-btn {
  margin: 10px;
  line-height: 1.1;
}
#search-bar {
  padding: 27px;
  padding-bottom: 0px;
  background-color: #e3e3e3;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}

.table-kiosk {
  width: 100%;
}

.table-kiosk th{
  border: 20px, solid, #aaa;
  width: 30%;
  height: 150px;
  font-size: 50px;
}
.kiosk-btn {
    width: 25%;
    height: 100px;
    margin: 5%;
}
.back-green {
  background-color: rgb(205, 240, 205);
}
.back-red {
  background-color: rgb(252, 196, 196);
}
.ag-theme-alpine, .ag-theme-alpine-dark, .ag-theme-alpine-auto-dark {
  --ag-font-size: 29px;
  --ag-grid-size: 8px;
}
.ag-cell, .ag-full-width-row .ag-cell-wrapper.ag-row-group {
  --ag-internal-calculated-line-height: 30px;
}
[class*=ag-theme-] {
  font-size: 30px !important;
}
</style>