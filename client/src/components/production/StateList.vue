<template>
  <div id="#req_details">
    <div style="margin-bottom: 10px;
                text-align: right;
                height: 38px;">
    </div>

    <div>
        <!--요청 자재 상세목록-->
        <v-card
          class="mx-auto"
          style=" width: 100%;
                  border-bottom-right-radius: 13px;
                  border-bottom-left-radius: 13px;
                  display: inline-block;">
          <template v-slot:title>
            <span class="font-weight-black">공정 현황</span>
          </template>
      <!-- 
        :autoGroupColumnDef="autoGroupColumnDef"
        :rowGroupPanelShow="rowGroupPanelShow"
        :groupDefaultExpanded="groupDefaultExpanded"
        -->
          <v-card-text class="bg-surface-light pt-4">
            <AgGridVue style=" height: 300px; margin: 0 auto;"
                  :defaultColDef="defaultColDef"
                  :rowData="rowData"
                  :gridOptions="gridOptions"
                  class="ag-theme-alpine">
              </AgGridVue>
          </v-card-text>
        </v-card>
    </div>


  </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
// import { AllCommunityModule, ModuleRegistry, ValidationModule } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
// import { RowGroupingModule, RowGroupingPanelModule } from 'ag-grid-enterprise';
// ModuleRegistry.registerModules([AllCommunityModule, RowGroupingModule, RowGroupingPanelModule, ValidationModule]);
ModuleRegistry.registerModules([AllCommunityModule,]);
import { ref, defineProps, onBeforeMount, watch } from "vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import { useToast } from 'primevue/usetoast';
import useDates from "@/utils/useDates";


let props = defineProps(["date", "code"]);

watch(props, async (newValue, oldValue) => {
  await getlist(newValue.date, newValue.code);
});

// 알림창
const toast = useToast();

//   toast.add({ severity: 'warn', summary: '자재부족', detail: '자재가 부족합니다\n재고를 확인해주세요.', life: 3000 });
//   toast.add({ severity: 'success', summary: '출고 성공', detail: '처리가 완료되었습니다.', life: 3000 });
//   toast.add({ severity: 'error', summary: '출고 실패', detail: '문제가 생겼습니다.\n관리자에게 문의해주세요.', life: 3000 });

//행 정보
const rowData = ref([]);

// 컬럼명 정의
// field : 배열안 객체의 필드명, headerName : 우리가 표시할 컬럼 이름, flex: 열 크기, hide: 숨길건지(검색시 필요할수도 있으니 표시할거만 표시), suppressToolPanel: hide 쓰면 같이 써야하는거
const ColDefs = [
  // { field: "prdctn_code", headerName:"지시코드", hide: true, suppressToolPanel: true, rowGruop: true, enableRowGroup: true },
  { field: "prdctn_code", headerName:"지시코드", hide: true, suppressToolPanel: true},
  { field: "procs_code", headerName:"공정코드", hide: true, suppressToolPanel: true },
  { field: "procs_nm", headerName:"공정명"},
  { field: "prd_code", headerName:"제품코드", hide: true, suppressToolPanel: true },
  { field: "prd_nm", headerName:"제품명", hide: true, suppressToolPanel: true },
  { field: "prdctn_co", headerName:"생산량", flex:0.5},
  { field: "eqp_code", headerName:"설비코드", hide: true, suppressToolPanel: true },
  { field: "matril_code", headerName:"재료코드", hide: true, suppressToolPanel: true },
  { field: "matril_nm", headerName:"재료명"},
  { field: "req_qy", headerName:"재료양", flex:0.5},
  { field: "begin_time", headerName:"시작일자"},
  { field: "end_time", headerName:"종료일자"},
  { field: "empl_no", headerName:"작업자코드", hide: true, suppressToolPanel: true },
  { field: "empl_nm", headerName:"작업자", flex:0.6},
];

// 공정 현황 리스트 불러오기
const getlist = async (date, code) => {
  let result = await axios.get(`${ajaxUrl}/prod/drcttable`, { params : { "day" : date, "code" : code } })
                          .catch(err => console.log(err));
  if(result != undefined ){
    for(let i = 0; i < result.data.length; i++){
      let begin = result.data[i].begin_time;
      let end = result.data[i].end_time;
      result.data[i].begin_time = useDates.dateFormat(begin, 'yyyy-MM-dd') + ' ' + useDates.timeFormat(begin, 'hh:mm:ss');
      result.data[i].end_time = useDates.dateFormat(end, 'yyyy-MM-dd') + ' ' + useDates.timeFormat(end, 'hh:mm:ss');
    }
    rowData.value = result.data;
  }
};
onBeforeMount(() => {
  getlist(props.date, props.code);
})

//ag grid 옵션 설정
const gridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      defaultColDef: {
          flex: 1,
          minWidth: 10
      },
      /*
      autoGroupColumnDef:{ minWidth: 200 },
      rowGroupPanelShow: "always",
      groupDefaultExpanded: ref(1),
      */

      
      
};

</script>
