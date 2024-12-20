<template>
  <div id="#req_details">
    <div style="margin-bottom: 10px;
                text-align: right;
                height: 38px;">
      <InputText type="text" v-model="emp_name" class="emp_info" readonly> <p>{{ emp_name }}</p></InputText>
      <InputText type="text" v-model="emp_id" class="emp_info" readonly> <p>{{ emp_id }}</p></InputText>
      
      <button type="button" class="btn btn-primary" 
       v-bind:disabled="isdlivyBtn"
       @click="registData"
       style="line-height: 1px; color: #fff;">
        자재 전체 출고</button>
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
            <span class="font-weight-black">요청 자재 상세목록</span>
          </template>
      
          <v-card-text class="bg-surface-light pt-4">
              <AgGridVue style=" height: 600px; margin: 0 auto;"
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
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { ref, watch } from "vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

//사원번호, 이름
const emp_name = '최태백';
const emp_id = 100;

//출고버튼 보여주는걸 결정하는 boolean타입변수
let isdlivyBtn = ref(true);
console.log(isdlivyBtn);

//부모로부터 가져옴
const props = defineProps(['code']);

//행 정보
const rowData = ref([]);

//요청명 리스트 컬럼 정의
const ColDefs = [
  { field: "req_name", headerName:"요청명", flex: 1.5},
  { field: "req_code", headerName:"요청 코드", hide: true, suppressToolPanel: true},
  { field: "mt_code", headerName:"자재코드"},
  { field: "mt_name", headerName:"자재명"},
  { field: "req_qy", headerName:"요청수량"},
  { field: "lot", headerName:"lot", flex: 2.5},
  { field: "lot_qy", headerName: "출고수량"},
  { field: "unit", headerName:"단위", flex: 0.8},
  { field: 'prdcnt_code', hide: true, suppressToolPanel: true}
];

//요청명 리스트
const getReqDetails = async (reqCode) => {
    //상세 자재 수량 가져오기
    let result = await axios.get(`${ajaxUrl}/mtril/mtRequestDetails/${reqCode}`)
                            .catch(err => console.log(err));
    
    console.log('result', result.data.length);
    console.log(result.data[(result.data.length-1)].state);

    if(result.data[(result.data.length-1)].state == 'fail') {
      //자재가 부족한 경우 처리
      //rowData.value = [{req_name : ''}]; //임의의 데이터를 한행 추가 보이진 않음. 이 작업이 없을경우 재고가 있는 행을 선택한 후 없는 행을 선택했을때 행이 비워지지 않음
      result.data.pop();  //배열 마지막 요소 제거
      rowData.value = result.data;

      //자재가 충분하지 않은경우 안내메시지
      toast.add({ severity: 'warn', summary: '자재부족', detail: '자재가 부족합니다\n재고를 확인해주세요.', life: 3000 });

      isdlivyBtn.value = true;
      console.log('비활성화: ', isdlivyBtn.value);

    } else {
      result.data.pop();  //배열 마지막 요소 제거

      //자재가 충분한 경우, 행 정보를 변수에 담음
      rowData.value = result.data;

      isdlivyBtn.value = false;
      console.log('활성화: ', isdlivyBtn.value);
    }
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
      },
      
};

//출고테이블 등록, 재고 수량 업데이트
const registData = async() => {
  console.log(rowData.value[0]);

  //서버로 보낼 새로운배열 선언(empl_no가 추가됨)
  let sendMtList = [];
  for(let i=0; i<rowData.value.length; i++) {
    //emp_id가 추가된 객체 생성
    let newObj = {...rowData.value[i], empl_no : emp_id};

    //배열에 추가
    sendMtList.push(newObj);
  };
  console.log(sendMtList);
  let result = await axios.post(`${ajaxUrl}/mtril/mtDlivy`,sendMtList )
                          .catch(err=> console.log(err));
  console.log(result.data);
  if(result.data == 'success') {
    //출고 성공 메시지
    toast.add({ severity: 'success', summary: '출고 성공', detail: '처리가 완료되었습니다.', life: 3000 });
    //행 초기화
    rowData.value = [];
  } else {
    //출고 실패 메시지
    toast.add({ severity: 'error', summary: '출고 실패', detail: '문제가 생겼습니다.\n관리자에게 문의해주세요.', life: 3000 });
  }
}
</script>

<style>
.emp_info {
  width: 100px;
  margin-right: 20px;
}
</style>