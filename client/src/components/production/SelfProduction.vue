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
            <span class="font-weight-black">자체 생산 추가</span>
          </template>
            <v-card-text class="bg-surface-light pt-4">
              <AgGridVue style=" height: 93px; margin: 0 auto;"
                  :defaultColDef="defaultColDef"
                  :rowData="rowData"
                  :onCellValueChanged="getprd"
                  @cellClicked="adddrct"
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
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { ref, watch, defineProps } from "vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import { useToast } from 'primevue/usetoast';
import prdselectbox from "./prdselectbox.vue";
import useDates from "@/utils/useDates";



// 알림창
const toast = useToast();

//   toast.add({ severity: 'warn', summary: '자재부족', detail: '자재가 부족합니다\n재고를 확인해주세요.', life: 3000 });
//   toast.add({ severity: 'success', summary: '출고 성공', detail: '처리가 완료되었습니다.', life: 3000 });
//   toast.add({ severity: 'error', summary: '출고 실패', detail: '문제가 생겼습니다.\n관리자에게 문의해주세요.', life: 3000 });

//행 정보 - 행이 하나라 따로 넣는 작업은 없음
const rowData = ref([{"prd_code":"", "prd_nm": "", "order_qy": 0, "dedt": ""}]);

// 컬럼명 정의
// field : 배열안 객체의 필드명, headerName : 우리가 표시할 컬럼 이름, flex: 열 크기, hide: 숨길건지(검색시 필요할수도 있으니 표시할거만 표시), suppressToolPanel: hide 쓰면 같이 써야하는거
const ColDefs = [
  { field: "prd_code", 
    headerName:"제품 코드", 
    editable: true, 
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: (params) => {
      console.log("파람",params);
      return { "values" : [...prdlist.value] }
  },
    // cellRenderer: prdselectbox
   },
  { field: "prd_nm", 
    headerName:"제품 명", 
    editable: true, 
    cellRenderer: (e) => {getprd(e)}
  },
  { field: "order_qy", headerName:"요청량" , editable: true},
  { field: "dedt", headerName: "기한", valueFormatter: (params) => {
          if (!params.value) {
            return "";
          }
          return `${ useDates.dateFormat(params.value, 'yyyy-MM-dd') }`
        },
        cellEditor: "agDateCellEditor", cellDataType: "date", editable: true },
  { field: "추가", headerName: "추가", cellRenderer: () => "추가"}
];


// 생산 추가 함수
const adddrct = async (event) => {
  if(event.colDef.field == "추가"){
      let result = await axios.post(`${ajaxUrl}/prod/insertdrct`, {"code": event.data.prd_code ,"qy": event.data.real_qy, "dedt": event.data.dedt })
                              .catch(err => console.log(err));
      if(result.data[0].retCode == 1){
        toast.add({ severity: 'success', summary: '추가 성공', detail: '처리가 완료되었습니다.', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: '추가 실패', detail: '추가 실패하였습니다. \n다시 시도해주십시오.', life: 3000 });
      }

      rowData.value = [{"prd_code":"", "prd_nm": "", "order_qy": 0, "dedt": ""}];
      // 생산 추가 이후 목록 다시 재 리스트

  }
};

const prdlist = ref([]);

const getprd = async (event) => {
  if(event.colDef.field == "prd_nm"){
    let result = await axios.get(`${ajaxUrl}/prod/prdlist`, event.newValue);
    if(result != undefined){
      prdlist.value = result.data;
    }
  }
  console.log("부모",prdlist);
};
// getprd(rowData.value[0].prd_nm);

//ag grid 옵션 설정
const gridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      defaultColDef: {
          flex: 1,
          minWidth: 10
      },
      
      
};

</script>