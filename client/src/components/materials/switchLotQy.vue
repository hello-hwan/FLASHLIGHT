<template>
    
    <span style="margin-left:20px">
        <button @click="modalOpen" class="btn  btn-primary" >상세수량</button>

        <div class="modal-wrap" @click="modalOpen" v-show="modalCheck">
        <div class="modal-container" @click.stop="">
            <div id="search-bar">
                <span>자재명</span>
                <InputText type="text" v-model="mtrilName" readonly> <p>{{ mtrilName }}</p></InputText>
                <div class="align-left">                
                    <span>로트명</span>
                    <InputText type="text" v-model="keyLotName" v-on:keyup.enter="searchMt"> <p>{{ keyLotName }}</p></InputText>
                    <span>입고 담당자</span>
                    <InputText type="text" v-model="wrhousingCharger" v-on:keyup.enter="searchMt"> <p>{{ wrhousingCharger }}</p></InputText>
                    <span>입고일</span>
                    <InputText type="date" v-model="wrhDateStart" v-on:keyup.enter="searchMt"> <p>{{ wrhDateStart }}</p></InputText>
                    <InputText type="date" v-model="wrhDateEnd" v-on:keyup.enter="searchMt"> <p>{{ wrhDateEnd }}</p></InputText>
                </div>
                <button @click="searchMt"class="btn btn-primary search-btn" >조회</button>
            </div>
            
            <AgGridVue 
                :rowData="rowData"
                :gridOptions="GridOptions"
                class="ag-theme-alpine"
                style="height: 500px"
                @grid-ready="onGridReady"
                >
            </AgGridVue>
            
            <div class="modal-btn">
            <button @click="modalOpen"class="btn btn-secondary">닫기</button>
            <button @click="selectOrder" class="btn btn-primary">확인</button>
            </div>
        </div>
        </div>
    </span>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { ref } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

import { defineProps } from "vue";

//부모 컴포넌트에서 보내준 데이터
const props = defineProps(["params"]);

const sendCodeToParent = () => {
  //console.log(props);
  const mtInfo = props.params.data; // 부모에서 선택한 행데이터
  console.log('버튼 컴포넌트', mtInfo);
};

//화면에 보일 자재명
let mtrilName = null;

//검색조건
let keyLotName = null;
let wrhousingCharger = null;

//그리드 api를 담을 변수
const gridApi = ref(null);

//grid가 생성될때 발생한 ag grid의 api를 변수에 담음
const onGridReady = (params) => {
    gridApi.value = params.api;
};

//모달 열림 상태 담을 변수
let modalCheck = ref(false);

//모달이 열리면 true로 변경, 스크롤 막기
const modalOpen = () => {
    const html = document.querySelector('html');
    if(modalCheck.value == false) {
        modalCheck.value = !modalCheck.value;
        html.style.overflow = 'hidden';
    } else {
        modalCheck.value = !modalCheck.value;
        html.style.overflow = 'auto';
    };
    //행 데이터 초기화
    rowData.value = [];
    
    //검색조건 초기화
    searchCompanyCode = null;
    searchcompanyName = null;
    searchchargerName = null;
}

//행 데이터를 담을 변수
const rowData = ref([]);

//열 정보: 번호, 발주명, 거래처코드, 거래처명, 선택
const ColDefs = [
  { field: "mtril_lot", headerName: "로트명"},
  { field: "mtril_qy", headerName: "재고 수량"},
  { field: "unit", headerName: "단위"},
  { field: "wrhousng_date", headerName: "입고일"},
  { field: "empl_name", headerName: "입고 담당자"}
];

const GridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
};

const searchMt = async() => {
    //서버로 보낼 검색 데이터
    let obj = {company_code: searchCompanyCode,
                company_name: searchcompanyName,
                charger_name: searchchargerName
            };
    //console.log("새로만든 객체: ",obj);
    let result = await axios.post(`${ajaxUrl}/mtril/searchCompany`, obj)
                            .catch(err=>console.log(err));

    //console.log("통신결과: ",result);
    //행 데이터 담기
    rowData.value = result.data;   
};
</script>


<style>
/* dimmed */
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 5;
}
/* modal or popup */
.modal-container {
    position: relative;
    top: 53%;
    left: 61%;
    transform: translate(-50%, -50%);
    width: 60%;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
}

.modal-btn button {
    line-height: 1.1;
    margin: 10px 0;
}
.align-left{
    margin: 10px 0;
}
.align-left>span {
    margin-left: 20px;
}
.search-btn {
    margin: 10px;
    line-height: 1.1;
}
#search-bar {
    padding: 27px;
    padding-bottom: 0px;
    background-color: #e3e3e3;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
}

</style>