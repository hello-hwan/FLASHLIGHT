<template>
    <div style="display: inline-block;
                width: 62%">
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
                  :rowData="rowData"
                  :gridOptions="gridOptions"
                  class="ag-theme-alpine"
                  @grid-ready = "onGridReady">
              </AgGridVue>
          </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { ref, watch, defineProps } from "vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';

//부모로부터 가져옴
const props = defineProps(['code']);

//행 정보
const rowData = ref([]);

//요청명 리스트 컬럼 정의
const ColDefs = [
  { field: "req_name", headerName:"요청명", flex: 1.2},
  { field: "req_code", headerName:"요청 코드", hide: true, suppressToolPanel: true},
  { field: "mt_code", headerName:"자재코드"},
  { field: "mt_name", headerName:"자재명"},
  { field: "req_qy", headerName:"요청수량"},
  { field: "lot", headerName:"lot", flex: 2.5},
  { field: "lot_qy", headerName: "출고수량"},
  { field: "unit", headerName:"단위", flex: 0.8}
];


//요청명 리스트
const getReqDetails = async (reqCode) => {
    //상세 자재 수량 가져오기
    let result = await axios.get(`${ajaxUrl}/mtril/mtRequestDetails/${reqCode}`)
                            .catch(err => console.log(err));
    //행 정보를 변수에 담음
    rowData.value = result.data;
    
    //console.log('getReqDetails: 작동확인');
};

/*props로 값을 받은경우 객체 형태이기 때문에 
watch(props.code, (newValue) => {}); 
의 일반적인 watch의 형태에서는 사용이 불가하다.
그래서 한번더 감싸는 깊은 복사의 형태가 된다. 
*/
watch(() => props.code, (newValue) => {
    //watch (변경을 감지하는 변수, (새로운 값, 이전값)), 값이 변경되면 아래 함수 실행됨.
    getReqDetails(newValue);
 
    //console.log('watch: 값이 변경됨');
});

//ag grid 옵션 설정
const gridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      defaultColDef: {
          flex: 1,
          minWidth: 10
      }

};

</script>