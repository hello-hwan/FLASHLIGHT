<template>
  <div>
    <div class="content-section">
      <v-card class="mx-auto card-custom-1" style="border-radius:13px;">
          <template v-slot:title>
              <span class="font-weight-black">
                출고조회
              </span>
          </template>
      </v-card>
    </div>
    <div class="search-condition">
      <v-card-text class="bg-surface-light pt-4">
        <span>요청명 </span>
        <InputText type="text" v-model="reqName"  v-on:keyup.enter="getList"> <p>{{ reqName }}</p></InputText>
        <span>자재명 </span>
        <InputText type="text" v-model="mtrilName"  v-on:keyup.enter="getList"> <p>{{ mtrilName }}</p></InputText>
        <span>담당자 </span>
        <InputText type="text" v-model="chargerName"  v-on:keyup.enter="getList"> <p>{{ chargerName }}</p></InputText>
        <span>요청날짜</span>
        <InputText type="date" v-model="reqDateStart" > <p>{{ reqDateStart }}</p></InputText> -
        <InputText type="date" v-model="reqDateEnd" > <p>{{ reqDateEnd }}</p></InputText>
        <div>
          <button @click="getList"class="btn btn-primary search-btn" >조회</button>
          <button @click="remove"class="btn btn-primary search-btn" >초기화</button>
        </div>
      </v-card-text>
    </div>

    <AgGridVue 
    :rowData="rowData"
    :gridOptions="GridOptions"
    class="ag-theme-alpine"
    style="height: 516px">
    </AgGridVue>
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

const reqName = ref("");
const mtrilName = ref("");
const chargerName = ref("");
const reqDateStart = ref("");
const reqDateEnd = ref("");

//열 정보: 번호, 발주명, 거래처코드, 거래처명, 선택
const ColDefs = [
  { field: "req_name", headerName: "요청명", flex:1},
  { field: "requst_date", headerName: "요청일자", flex:1, valueFormatter: (params) => {
          if (!params.value) {
            return "";
          }
          params.value = new Date(params.value);
          const month = params.value.getMonth() + 1;
          const day = params.value.getDate();
          return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        }},
  { field: "mtril_code", headerName: "자재코드", flex:1},
  { field: "mtril_name", headerName: "자재명", flex:1},
  { field: "mtril_lot", headerName: "lot", flex:1},
  { field: "dlivy_qy", headerName: "출고수량", flex:1},
  { field: "unit", headerName: "단위", flex:1},
  { field: "charger", headerName: "담당자", flex:1},
];

//데이터 가져오기
const getList = async() => {
    let obj = {req_name: reqName.value,
                mtril_name: mtrilName.value,
                charger_name: chargerName.value,
                start_date: reqDateStart.value,
                end_date: reqDateEnd.value
    };

    let result = await axios.post(`${ajaxUrl}/mtril/dlivyList`, obj)
                            .catch(err=> console.log(err));

    //console.log(result.data);
    //행 데이터 담기
    rowData.value = result.data;
};
getList();

//검색조건 삭제
const remove = () => {
    reqName.value = "";
    mtrilName.value = ""; 
    chargerName.value = "";
    reqDateStart.value = "";
    reqDateEnd .value = "";

    getList();
};

//ag grid 테이블 속성 설정
const GridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
};
</script>

<style scoped>
.search-condition{
  margin: 30px 0;
}
input[type="text"] {
  width: 140px;
  margin-right: 20px;
}
</style>
