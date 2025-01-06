<template>
    <div>
        <v-card class="mx-auto card-custom-1" style="border-radius:13px; text-align: center;">
            <template v-slot:title>
                <span class="font-weight-black">
                    입고검사
                </span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
                <!--발주건 조회-->
                <div style="text-align: right; position: relative; z-index: 100;">
                    <requestModal @selectedData="getOrderData"/>
                </div>
                <div style="display: none;">
                    <span>발주번호</span>
                    <InputText type="text" v-model="orderNo" > <p>{{ orderNo }}</p></InputText>
                </div>
                <span>발주명</span>
                <InputText type="text" v-model="orderName" > <p>{{ orderName }}</p></InputText>
                <span>거래처코드</span>
                <InputText type="text" v-model="companyCode" > <p>{{ companyCode }}</p></InputText>
                <span>거래처명</span>
                <InputText type="text" v-model="companyName" > <p>{{ companyName }}</p></InputText>
            </v-card-text>
        </v-card>  
        
        <div >
            <v-card class="mx-auto" style="margin-top:30px; border-radius: 13px; position: relative; z-index: 0;">
                <v-card-text class="bg-surface-light pt-4">
                    <div style="text-align: right;">    
                        <span>담당자 </span>
                        <InputText type="text" v-model="chargerName" style="width:80px; margin-bottom: 5px;"> <p>{{ chargerName }}</p></InputText>
                        <button type="button" class="btn btn-warning" style="color: #fff; line-height: 1;" @click="removeData()">초기화</button>    
                        <button type="button" class="btn btn-primary" style="color: #fff; line-height: 1;" @click="insertInfoList()">등록</button>
                    </div>
                    <div>
                        <ag-grid-vue :rowData="rowData" 
                                    :columnDefs="colDefs" 
                                    :gridOptions="gridOptions" 
                                    style="height: 500px;"
                                    @grid-ready="onGridReady" 
                                    class="ag-theme-alpine">
                        </ag-grid-vue>            
                    </div>        
        
                </v-card-text>
            </v-card>
        </div>


    </div>
</template>
   
<script setup>
import { ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import requestModal from '@/components/quality/qualityRequestModal.vue';

import { useRouter } from 'vue-router'  //라우터 가져오기
const router = useRouter();

import { useStore } from 'vuex'; // Vuex 스토어 가져오기
const store = useStore();

import { useToast } from 'primevue/usetoast';   //toast가져오기
const toast = useToast();

//발주건 정보
const orderNo = ref("");
const orderName = ref("");
const companyCode =ref("");
const companyName =ref("");
const chargerName = store.state.empInfo[store.state.empInfo.length-1].name;

//발주건 자재 목록 행 데이터 저장할 변수
const rowData = ref([]);

//발주건 자재 목록 ag grid 컬럼 선언
const colDefs = [
    { field: 'mtril_code', headerName: '자재코드', flex:1},
    { field: 'mtril_name', headerName: '자재명', flex:1},
    { field: 'inspec_standard', headerName: '검사기준', flex:1 },
    { field: 'order_qy', headerName: '주문 수량', flex:1 },
    { field: 'error_amount', headerName: '불량 수량', editable: true , flex:1},
    { field: 'unit', headerName: '단위', editable: true , flex:1},
    { field: 'result', headerName: '검사 결과', editable: true, 
      cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['합격', '불합격'] }, flex:1}];

//발주건 자재 목록 ag grid 그리드 옵션
const gridOptions = {
    columnDefs: colDefs.value,
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
    paginateChildRows: true,
    animateRows: false,
    rowSelection: 'single'};

//품질검사 등록
const insertInfoList = async () => {
    console.log(rowData.value);
    //server로 전송할 데이터
    let newDataList = [];
    for(let i=0; i<rowData.value.length; i++) {
        if(rowData.value[i].result == undefined) {
            toast.add({ severity: 'warn', summary: '입력 오류', detail: '검사 결과를 입력해주세요', life: 3000 });
            return;
        };
        newDataList.push({mtril_code: rowData.value[i].mtril_code,
                          mtril_name: rowData.value[i].mtril_name,
                          rec_num: rowData.value[i].order_qy,
                          mtlty_name: companyName.value,
                          empl_no: store.state.empInfo[store.state.empInfo.length-1].user_id,
                          pass_amount: (rowData.value[i].order_qy - rowData.value[i].error_amount), //통과수량 = 발주수량 - 불량 수량
                          order_no: orderNo.value,
                          bcnc_code: companyCode.value,
                          inspec_standard: rowData.value[i].inspec_standard,
                          inspec_item: rowData.value[i].mtril_code,
                          p_result: rowData.value[i].result,
                          error_amount: rowData.value[i].error_amount});
    };
    let result = await axios.post(`${ajaxUrl}/quality/insertQiList`, newDataList)
                            .catch(err => console.log(err));
    console.log(result.data);
    if(result.data) {
        toast.add({ severity: 'success', summary: '검사 완료', detail: '처리가 완료되었습니다', life: 3000 });
        removeData();
    } else {
        toast.add({ severity: 'warn', summary: '검사 실패', detail: '불량 수량을 입력해주세요', life: 3000 });
    }

    //새로고침
    //router.go(0);
};

//화면에 보이는 데이터 삭제
const removeData = () => {
    //새로고침
    //router.go(0);
    orderNo.value = "";
    orderName.value = "";
    companyCode.value ="";
    companyName.value ="";
    rowData.value = [];
};

//검색 모달에서 가져온 발주 데이터
const getOrderData = (info) => {
    //모달에서 가져온 데이터를 화면에 반영하기
    orderNo.value = info[0].order_no;
    orderName.value = info[0].order_name;
    companyCode.value = info[0].bcnc_code;
    companyName.value = info[0].mtlty_name;

    //db에서 자재 검색, 테이블에 데이터 넣기
    getMtList(info[0].order_code);
};

//발주데이터를 기반으로 db에서 발주건에 있는 자재리스트 가져와서 테이블에 넣기
const getMtList = async(orderCode) => {
    let result = await axios.get(`${ajaxUrl}/quality/mtrilList/${orderCode}`)
                            .catch(err => console.log(err));

    console.log(result);
    rowData.value = result.data;
};

</script>

<style scoped>
button {
    margin: 4px 10px;
}
input {
    width: 200px;
    margin-right: 30px;
}
.ag-theme-alpine {
    z-index: 1;
}
</style>

