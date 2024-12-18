<template>
    <div style="display: inline-block;
                width: 55%">
        <!--요청 자재 상세목록-->
        <v-card
          class="mx-auto"
          style=" width: 100%;
                  border-bottom-right-radius: 13px;
                  border-bottom-left-radius: 13px;
                  display: inline-block;"
        >
          <template v-slot:title>
            <span class="font-weight-black">요청 자재 상세목록</span>
          </template>
      
          <v-card-text class="bg-surface-light pt-4">
              <AgGridVue style=" height: 600px; margin: 0 auto;"
                  :defaultColDef="defaultColDef"
                  :rowData="mtRowData"
                  :gridOptions="gridOptions"
                  class="ag-theme-alpine"
                  id="grid-two">
              </AgGridVue>
          </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

//요청명 리스트 컬럼 정의
const ColDefs = [
  { field: "name", headerName:"요청명"},
  { field: "code", headerName:"요청 코드" },
  { field: "req_date", headerName:"요청 날짜"},
  { field: "action", headerName:"상세보기"}
];

//ag grid 옵션 설정
const gridOptions = {
      columnDefs: ColDefs,
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