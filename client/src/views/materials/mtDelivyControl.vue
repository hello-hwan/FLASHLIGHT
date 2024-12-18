<template>
  <div>
    <!--자재 요청 리스트-->
    <v-card
        class="mx-auto"
        style=" width: 40%; 
                border-bottom-right-radius: 13px;
                border-bottom-left-radius: 13px;
                display: inline-block;
                margin-right: 30px;
                margin-right: 4% !important;"
      >
        <template v-slot:title>
          <span class="font-weight-black">자재 요청 리스트</span>
        </template>
    
        <v-card-text class="bg-surface-light pt-4">
            <AgGridVue style=" height: 600px; margin: 0 auto; "
                :defaultColDef="defaultColDef"
                :rowData="reqRowData"
                :gridOptions="gridOptionsReq"
                :frameworkComponents="frameworkComponents"
                class="ag-theme-alpine"
                >
            </AgGridVue>
        </v-card-text>
      </v-card>
      <!--자재 상세보기-->
      <detailTable />
  </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { ref } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import useDateUtils from '@/utils/useDates.js';
import goDetails from '@/components/materials/mtReqGotoDetails.vue'; //상세보기 버튼
import detailTable from '@/components/materials/mtDetailTable.vue'; //요청 자재 상세보기 테이블

//요청명리스트 담을 변수
const reqRowData = ref([]);

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
  { field: "action", headerName:"상세보기", cellRenderer: goDetails}
];

//선택한 행의 요청코드
const reqCodeForCondition = ref('');

//자식 컴포넌트에서 가져온 데이터 변수에 저장
const getReqCode = (reqCode) => {
  console.log(reqCode); //데이터 확인
  reqCodeForCondition.value = reqCode;
}

//ag grid 옵션 설정
const gridOptionsReq = {
      context: {
        componentParent: { getReqCode } 
        /*
        cellRenderer에 설정한 자식 컴포넌트의 값을 받기위한 방식.
        emit대신이라고 생각해야 될 것 같음. emit은 부모에서 이벤트가 있고 하위 컴포넌트에서 
        어떤 데이터를 돌려줘야하는 형식이라면 cellRendereer는 조금 다름.
        이벤트 자체가 하위 컴포넌트에서 발생하기 때문에 emit사용 불가*/
      },
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