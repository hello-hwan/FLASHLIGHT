<template>
  <div style="display: flex;">
    <v-card
        class="mx-auto"
        style="border-radius: 13px; width: 40%; "
      >
        <template v-slot:title>
          <span class="font-weight-black">자재 요청 리스트</span>
        </template>
    
        <v-card-text class="bg-surface-light pt-4">
            <AgGridVue style=" height: 500px; margin: 0 auto; "
                @grid-ready="onGridReady"
                :defaultColDef="defaultColDef"
                :rowData="reqRowData"
                :gridOptions="gridOptionsReq"
                class="ag-theme-alpine"
                >
            </AgGridVue>
        </v-card-text>
      </v-card>

      <!-- <v-card
        class="mx-auto"
        style="border-radius: 13px;  width: 60%;"
      >
        <template v-slot:title>
          <span class="font-weight-black">요청 자재 상세목록</span>
        </template>
    
        <v-card-text class="bg-surface-light pt-4">
            <AgGridVue style=" height: 500px; margin: 0 auto;"
                @grid-ready="onGridReady"
                :defaultColDef="defaultColDef"
                :rowData="mtRowData"
                :gridOptions="gridOptionsMt"
                class="ag-theme-alpine"
                id="grid-two">
            </AgGridVue>
        </v-card-text>
      </v-card> -->
  </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { shallowRef } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import useDateUtils from '@/utils/useDates.js';

//요청명리스트 담을 변수
const reqRowData = shallowRef([]);

//요청명 리스트 가져오기
const getReqList = async function() {
  let result = await axios.get(`${ajaxUrl}/mtril/mtRequest`)
                          .catch(err => console.log(err));
  //console.log(result);  //데이터 확인
  //데이터 담기
  reqRowData.value = result.data;
}

//요청명 리스트 데이터 담기 함수 실행
getReqList();

//날짜 포멧
const customDateFormat = (params) => {
  //console.log(params);
  return useDateUtils.dateFormat(params.values, 'yyyy-MM-dd');
};

//요청명 리스트 컬럼 정의
const reqColDefs = [
  { field: "name", headerName:"요청명"},
  { field: "code", headerName:"요청 코드" },
  { field: "req_date", headerName:"요청 날짜" , valueFormatter: customDateFormat},
  { field: "action", headerName:"상세보기"}
];

//ag grid 옵션 설정
const gridOptionsReq = {
      columnDefs: reqColDefs,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20],
      paginateChildRows: true,
      animateRows: false,
      defaultColDef: {
          flex: 1,
          minWidth: 10
      }
  };
</script>