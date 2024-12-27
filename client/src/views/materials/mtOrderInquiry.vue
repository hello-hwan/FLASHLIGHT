<template>
    <h1>자재 발주조회</h1>
    <div>
        <span>
            <span>발주명</span>
            <InputText type="text" v-model="orderName" v-on:keyup.enter="searchOrderList"> <p>{{ orderName }}</p></InputText>
            <span>자재명</span>
            <InputText type="text" v-model="mtrilName" v-on:keyup.enter="searchOrderList"> <p>{{ mtrilName }}</p></InputText>
            <span>거래처 상호명</span>
            <InputText type="text" v-model="companyName" v-on:keyup.enter="searchOrderList"> <p>{{ companyName }}</p></InputText>
            <span>발주 담당자</span>
            <InputText type="text" v-model="chargerName" v-on:keyup.enter="searchOrderList"> <p>{{ chargerName }}</p></InputText>
        </span>
        <span>                
            <span>발주일</span>
            <InputText type="date" v-model="startOrderDate"> <p>{{ startOrderDate }}</p></InputText>
            <InputText type="date" v-model="endOrderDate"> <p>{{ endOrderDate }}</p></InputText>
            <span>납기일</span>
            <InputText type="date" v-model="startDedt"> <p>{{ startDedt }}</p></InputText>
            <InputText type="date" v-model="endDedt"> <p>{{ endDedt }}</p></InputText>
        </span>
        <button @click="searchOrderList" class="btn btn-primary search-btn" >조회</button>
        <button @click="resetSearchKey" class="btn btn-primary search-btn" >초기화</button>
    </div>

    <AgGridVue 
        :rowData="mtRowData"
        :gridOptions="mtGridOptions"
        rowSelection="multiple"
        class="ag-theme-alpine"
        @grid-ready="mtOnGridReady"
        style="height: 516px">
        </AgGridVue>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { ref } from 'vue';
import { ajaxUrl } from '@/utils/commons';
import axios from 'axios';


const dateFormatter = (params) => {
    if (!params.value) {
    return "";
    }
    params.value = new Date(params.value);
    const month = params.value.getMonth() + 1;
    const day = params.value.getDate();
    return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
};

//검색조건
let orderName = ref(null);   //발주명
let mtrilName = ref(null);   //자재명
let companyName = ref(null); //거래처 상호명
let startOrderDate = ref(null);  //발주일 시작
let endOrderDate = ref(null);    //발주일 끝
let startDedt = ref(null);   //납기일 시작
let endDedt = ref(null);     //납기일 끝
let chargerName = ref(null);     //납기일 끝

//자재 발주 완료 행 데이터
const mtRowData = ref([]);

//요청 리스트 열 정보
const mtOrderColDefs = [
  { field: "order_code", headerName:"발주코드", flex: 1.2},
  { field: "order_name", headerName:"발주명", flex: 2 },
  { field: "mtril_code", headerName:"자재코드", flex: 1 },
  { field: "mtril_name", headerName:"자재명", flex: 1},
  { field: "bcnc_code", headerName:"거래처코드", flex: 1},
  { field: "mtlty_name", headerName:"거래처명", flex: 1},
  { field: "order_price", headerName:"입고단가", flex: 0.7},
  { field: "order_qy", headerName:"수량", flex: 0.6},
  { field: "unit", headerName:"단위", flex: 0.6},
  { field: "order_date", headerName:"발주일", flex: 0.9, valueFormatter: dateFormatter },
  { field: "dedt", headerName:"납기일" , flex: 0.9, valueFormatter: dateFormatter},
  { field: "empl_name", headerName:"담당자", flex: 0.7}
];

//자재 발주 완료 목록 ag grid설정
const mtGridOptions = {
      columnDefs: mtOrderColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20],
      paginateChildRows: true
};

//발주건 검색
const searchOrderList = async() => {
    //검색조건을 담을 객체
    let obj = {order_name: orderName.value,
                mtril_name: mtrilName.value,
                company_name: companyName.value,
                start_order_date: startOrderDate.value,
                end_order_date: endOrderDate.value,
                start_dedt: startDedt.value,
                end_dedt: endDedt.value,
                charger_name: chargerName.value};
    let result = await axios.post(`${ajaxUrl}/mtril/allOrderList`, obj )
                            .catch(err=>console.log(err));

    console.log(result);
    //가져온 데이터 행에 넣기
    mtRowData.value = result.data;
};
searchOrderList();

//검색 조건 초기화
const resetSearchKey = () => {
    orderName.value = null;   //발주명
    mtrilName.value = null;   //자재명
    companyName.value = null; //거래처 상호명
    startOrderDate.value = null;  //발주일 시작
    endOrderDate.value = null;    //발주일 끝
    startDedt.value = null;   //납기일 시작
    endDedt.value = null;     //납기일 끝
    chargerName.value = null;     //납기일 끝
};
</script>

<style scoped>
.ag-root-wrapper.ag-layout-normal {
    height: 92.3%;
}
</style>