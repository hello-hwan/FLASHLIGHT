<template>
  <div>
    <div class="content-section">
      <v-card class="mx-auto card-custom-1" style="border-radius:13px; text-align: center;">
        <template v-slot:title>
            <span class="font-weight-black">
              입고 조회
            </span>
        </template>
        <v-card-text class="bg-surface-light pt-4">
          <span>구분 </span>
          <select v-model="selected">
            <option value="">전체</option>
            <option value="MW01">발주</option>
            <option value="MW02">반환</option>
          </select>
          <span>자재명 </span>
          <InputText type="text" v-model="mtrilName" class="emp_info" v-on:keyup.enter="getList"> <p>{{ mtrilName }}</p></InputText>
          <span>담당자 </span>
          <InputText type="text" v-model="chargerName" class="emp_info" v-on:keyup.enter="getList"> <p>{{ chargerName }}</p></InputText>
          <span>입고일 </span>
          <InputText type="date" v-model="wrhDateStart" class="emp_info"> <p>{{ wrhDateStart }}</p></InputText>-
          <InputText type="date" v-model="wrhDateEnd" class="emp_info"> <p>{{ wrhDateEnd }}</p></InputText>
          <div style="width: 100%;">
            <button @click="remove"class="btn btn-secondary search-btn" >초기화</button>
            <button @click="getList"class="btn btn-primary search-btn" >조회</button>
          </div>
        </v-card-text>
      </v-card>
    </div>


    <div class="content-section">
      <v-card-text class="bg-surface-light pt-4">
        <AgGridVue 
        :rowData="rowData"
        :gridOptions="GridOptions"
        class="ag-theme-alpine"
        style="height: 516px"
        @grid-ready="onGridReady">
        </AgGridVue>
        <button @click="onBtnExportDataAsCsv" class="btn btn-primary search-btn" >EXCEL 내보내기</button>
      </v-card-text>
    </div>
  </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { ref } from 'vue';
import { ajaxUrl } from "@/utils/commons";
import axios from 'axios';

//행 데이터를 담을 변수
const rowData = ref([]);

const selected = ref(""); //기본값 설정 (전체)
const mtrilName = ref("");
const chargerName = ref("");
const wrhDateStart = ref("");
const wrhDateEnd = ref("");

/*
값 변경되는지 확인
watch(() => selected.value, (newVal) => {
  console.log(newVal);
});
*/

//열 정보: 번호, 발주명, 거래처코드, 거래처명, 선택
const ColDefs = [
  { field: "mtril_code", headerName: "자재코드", flex:1},
  { field: "mtril_name", headerName: "자재명", flex:1},
  { field: "wrh_qy", headerName: "검사통과량\n반환수량", flex:1},
  { field: "unit", headerName: "단위", flex:1},
  { field: "mtril_lot", headerName: "lot", flex:1},
  { field: "wrhousng_se", headerName: "구분", flex:1},
  { field: "wrhousng_date", headerName: "입고일", flex:1, valueFormatter: (params) => {
          if (!params.value) {
            return "";
          }
          params.value = new Date(params.value);
          const month = params.value.getMonth() + 1;
          const day = params.value.getDate();
          return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        }},
  { field: "empl_name", headerName: "담당자", flex:1},
];

//ag grid 테이블 속성 설정
const GridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
};

//데이터 가져오기
const getList = async() => {
    let obj = {selected: selected.value,
               mtril_name: mtrilName.value,
               charger_name: chargerName.value,
               start_date: wrhDateStart.value,
               end_date: wrhDateEnd.value
    };
    let result = await axios.post(`${ajaxUrl}/mtril/wrhousingList`, obj)
                            .catch(err=> console.log(err));

    console.log(result.data);
    //행 데이터 담기
    rowData.value = result.data;
};
getList();

//검색조건 삭제
const remove = () => {
  selected.value = "";
  mtrilName.value = "";
  chargerName.value = "";
  wrhDateStart.value = "";
  wrhDateEnd.value = "";

  //조회
  getList();
};

//gridapi를 저장할 변수
const gridApi = ref(null);

//gridapi저장
const onGridReady = (params) => {
    gridApi.value = params.api;
};
//엑셀 내보내기
const onBtnExportDataAsCsv = () => {
    gridApi.value.exportDataAsCsv();
};

</script>

<style scoped>
.content-section {
  margin-bottom: 30px;
}
select {
  -webkit-appearance: auto;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #d6d6d6;
  width: 80px;
  height: 42px;
  text-align: center;
  margin-right: 20px;
}
input[type="date"] {
  width: 150px;
  margin-right: 2px;
}
.text-align-center {
  text-align: center;
}
</style>
