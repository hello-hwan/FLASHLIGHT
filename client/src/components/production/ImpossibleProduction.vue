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
              <span class="font-weight-black">생산 불가능 제품</span>
            </template>
        
            <v-card-text class="bg-surface-light pt-4">
                <AgGridVue style=" height: 300px; margin: 0 auto;"
                    :defaultColDef="defaultColDef"
                    :rowData="rowData"
                    @cellClicked="realReq"
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
  
  
  // 알림창
  const toast = useToast();

  //   toast.add({ severity: 'warn', summary: '자재부족', detail: '자재가 부족합니다\n재고를 확인해주세요.', life: 3000 });
  //   toast.add({ severity: 'success', summary: '출고 성공', detail: '처리가 완료되었습니다.', life: 3000 });
  //   toast.add({ severity: 'error', summary: '출고 실패', detail: '문제가 생겼습니다.\n관리자에게 문의해주세요.', life: 3000 });

  /*
  //출고버튼 보여주는걸 결정하는 boolean타입변수
  let isdlivyBtn = ref(true);
  console.log(isdlivyBtn);
  
  //부모로부터 가져옴
  const props = defineProps(['code']);

 props로 값을 받은경우 객체 형태이기 때문에 
 watch(props.code, (newValue) => {}); 
 의 일반적인 watch의 형태에서는 사용이 불가하다.
 그래서 한번더 감싸는 깊은 복사의 형태가 된다. 
 watch(() => props.code, (newValue) => {
   //watch (변경을 감지하는 변수, (새로운 값, 이전값)), 값이 변경되면 아래 함수 실행됨.
   getReqDetails(newValue);
   
   //console.log('watch: 값이 변경됨');
   
   });
*/

  //행 정보
  const rowData = ref([]);
  
  // 컬럼명 정의
  // field : 배열안 객체의 필드명, headerName : 우리가 표시할 컬럼 이름, flex: 열 크기, hide: 숨길건지(검색시 필요할수도 있으니 표시할거만 표시), suppressToolPanel: hide 쓰면 같이 써야하는거
  const ColDefs = [
    { field: "req_code", headerName:"요청 코드", hide: true, suppressToolPanel: true},
    { field: "prd_code", headerName:"제품 코드"},
    { field: "prd_nm", headerName:"제품 명"},
    { field: "mtril_code", headerName:"부족 자재 코드"},
    { field: "mtril_nm", headerName:"부족 자재 명"},
    { field: "req_qy", headerName:"부족 자재 수량"},
    { field: "real_qy", headerName:"요청량" , editable: true},
    { field: "요청", headerName: "요청", cellRenderer: () => "요청"}
  ];


  const getlist = async () => {
    let result = await axios.get(`${ajaxUrl}/prod/reqlist`)
                            .catch(err => console.log(err));
    rowData.value = result.data;
  };
  getlist();
  
  const realReq = async (event) => {
    if(event.colDef.field == "요청"){
        let result = await axios.put(`${ajaxUrl}/prod/requpdate/${event.data.req_code}`, {"qy": event.data.real_qy})
                                .catch(err => console.log(err));
        if(result.data[0].retCode == 1){
          toast.add({ severity: 'success', summary: '요청 성공', detail: '처리가 완료되었습니다.', life: 3000 });
        } else {
          toast.add({ severity: 'error', summary: '요청 실패', detail: '요청에 실패하였습니다. \n다시 시도해주십시오.', life: 3000 });
        }
        getlist();
    }
  }
  
  //ag grid 옵션 설정
  const gridOptions = {
        columnDefs: ColDefs,
        pagination: true,
        paginationPageSize: 5,
        paginationPageSizeSelector: [5, 10, 50, 100],
        paginateChildRows: true,
        animateRows: false,
        defaultColDef: {
            flex: 1,
            minWidth: 10
        },
        
        
  };
  
  </script>
  