<template>
  <div>
    <!--자재 요청 리스트-->
    <v-card
        class="mx-auto"
        style=" width: 100%; 
                border-bottom-right-radius: 13px;
                border-bottom-left-radius: 13px;
                display: inline-block;
                margin-bottom: 27px;
                text-align: center;"
      >
        <template v-slot:title>
          <span class="font-weight-black">자재 요청 리스트</span>
        </template>
    
        <v-card-text class="bg-surface-light pt-4">
            <AgGridVue style=" margin: 0 auto; "
                :defaultColDef="defaultColDef"
                :rowData="reqRowData"
                :gridOptions="gridOptionsReq"
                :frameworkComponents="frameworkComponents"
                class="ag-theme-alpine"
                domLayout="autoHeight"
                >
            </AgGridVue>
        </v-card-text>
      </v-card>

      <!--자재 상세보기 ref객체로 감싼경우 
      .value를 사용하지 않아도 template에서는 그대로 사용가능하다.
      스크립트 내부에서 값을 사용할 때는 .value를 사용해야 됨.-->
      <detailTable v-bind:code="reqCodeForCondition" @removeRowDataInfo="removeRow"/>

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
import detailTable from '@/components/materials/mtDelivyDetailTable.vue'; //요청 자재 상세보기 테이블

//요청명리스트 담을 변수
const reqRowData = ref([]);

//요청명 리스트 가져오기
const getReqList = async () => {
  let result = await axios.get(`${ajaxUrl}/mtril/mtRequest`)
                          .catch(err => console.log(err));
  //console.log(result);  //데이터 확인
  //데이터 담기
  reqRowData.value = result.data;
};

//요청명 리스트 데이터 담기 함수 실행
getReqList();

//날짜 포멧
const customDateFormat = (params) => {
  //console.log(params);
  return useDateUtils.dateFormat(params.values, 'yyyy-MM-dd');
};

//요청명 리스트 컬럼 정의
const reqColDefs = [
  { field: "name", headerName:"요청명", flex: 2.6},
  { field: "code", headerName:"요청 코드" },
  { field: "req_date", headerName:"요청 날짜" , valueFormatter: customDateFormat},
  { field: "action", headerName:"상세보기", cellRenderer: goDetails, flex:0.8}
];

//선택한 행의 요청코드
const reqCodeForCondition = ref('');

//자식 컴포넌트에서 가져온 데이터 변수에 저장
const getReqCode = (reqCode) => {
  reqCodeForCondition.value = reqCode;
  console.log('부모 컴포넌트: ', reqCodeForCondition.value); //확인
}
// let info = ref('');
//자식 컴포넌트에서 보내진 삭제될 행의 prdctn_code를 가져옴, 해당 행을 삭제
const removeRow = (delRowInfo) => {
  // console.log(delRowInfo);


  console.log("info: ", delRowInfo);
  for(let i=0; i<reqRowData.value.length; i++) {
    console.log('작동');
    console.log("code: ", reqRowData.value[i].code);
    if(delRowInfo == reqRowData.value[i].code) {
      
      reqRowData.value.splice(i, 1);
    };
  };
};

//ag grid 옵션 설정
const gridOptionsReq = {
      context: {
        componentParent: { getReqCode } 
        /*
        cellRenderer에 설정한 자식 컴포넌트의 값을 받기위한 방식.
        emit대신이라고 생각해야 될 것 같음. 
        cellrenderer안에서 emit으로 받을 값을 받을 
        함수를 설정할 수 없기 때문에 emit사용 불가*/
      },
      columnDefs: reqColDefs,
      pagination: true,
      paginationPageSize: 5,
      paginationPageSizeSelector: [5, 10],
      paginateChildRows: true,
      animateRows: false,
      defaultColDef: {
          flex: 1,
          minWidth: 10
      }
};



</script>