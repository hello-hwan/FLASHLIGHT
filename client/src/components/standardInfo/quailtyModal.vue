<template>
    <span style="margin-left:20px">
        <button type="button" @click="modalOpen"
        class="btn btn-primary"
        style="line-height: 1px; color: #fff;">검색</button>

        <div class="modal-wrap" @click="modalOpen" v-show="modalCheck">
        <div class="modal-container" @click.stop="">
            <div id="search-bar">              
               
                <div>
                    <span>품목코드</span>
                    <InputText type="text" v-model="prd_code" v-on:keyup.enter="searchOrder"> <p>{{ prd_code }}</p></InputText>
                </div>
                <button @click="searchOrder"class="btn btn-primary search-btn" >조회</button>
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


//부모 행 삭제를 위해서 사용하는 emit
const emit = defineEmits(["quailtyselectedData"]);

//검색조건
let prd_code = null;

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
    prd_code = null;  
}

//모달 발주건을 선택하고 확인버튼 클릭
const selectOrder = () => {
    modalOpen()
    const selectedNodes = gridApi.value.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);

    console.log('선택된 행 데이터:', quailtyselectedData);
    emit("quailtyselectedData", selectedData);
};
//행 데이터를 담을 변수
const rowData = ref([]);


const ColDefs = [
 
  { field: "prd_code", headerName: "품목코드"},  
  { field: "mtril_name", headerName: "자재명"}, 
  { field: "mtlty_name", headerName:"거래처명"},
  { field: "empl_no", headerName:"사원번호"},
 {headerName : "선택",  checkboxSelection: true, flex:0.3}
 
];

const GridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
};

const searchOrder = async() => {
    //서버로 보낼 검색 데이터
    let result = await axios.post(`${ajaxUrl}/standardInfo/qiListModal`)
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
  z-index: 3;
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