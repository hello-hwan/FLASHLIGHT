<template>
    <div>
        <span>요청명</span>
        <InputText type="text" v-model="reqName" class="emp_info"> <p>{{ reqName }}</p></InputText>
        <span>자재명</span>
        <InputText type="text" v-model="mtrilName" class="emp_info"> <p>{{ mtrilName }}</p></InputText>
        <span>담당자</span>
        <InputText type="text" v-model="chargerName" class="emp_info"> <p>{{ chargerName }}</p></InputText>
        <span>요청날짜</span>
        <InputText type="date" v-model="reqDateStart" class="emp_info"> <p>{{ reqDateStart }}</p></InputText>
        <InputText type="date" v-model="reqDateEnd" class="emp_info"> <p>{{ reqDateEnd }}</p></InputText>
    </div>
    <h1>출고조회</h1>
    <AgGridVue 
    :rowData="rowData"
    :gridOptions="GridOptions"
    class="ag-theme-alpine"
    style="height: 516px">
    </AgGridVue>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { ref } from 'vue';
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
  { field: "req_date", headerName: "요청일자", flex:1},
  { field: "mtril_code", headerName: "자재코드", flex:1},
  { field: "mtril_name", headerName: "자재명", flex:1},
  { field: "mtril_lot", headerName: "lot", flex:1},
  { field: "dlivy_qy", headerName: "출고수량", flex:1},
  { field: "unit", headerName: "단위", flex:1},
  { field: "charger", headerName: "담당자", flex:1},
];

//ag grid 테이블 속성 설정
const GridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
};
</script>
