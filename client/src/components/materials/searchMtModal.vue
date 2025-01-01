<template>
    <span style="margin-left:20px">
        <!--버튼-->
        <button type="button" @click="modalOpen"
        class="btn btn-primary"
        style="line-height: 1px; color: #fff;">행 추가</button>

        <!--모달 영역-->
        <div class="modal-wrap" @click="modalOpen" v-show="modalCheck">
            <div class="modal-container" @click.stop="">
                <div class="search-bar">
                    <div>             
                        <span>자재명</span>
                        <InputText type="text" v-model="mtrilName" v-on:keyup.enter="searchCompany"> <p>{{ mtrilName }}</p></InputText>
                    </div>
                    <div>
                        <span>자재코드</span>
                        <InputText type="text" v-model="mtrilCode" v-on:keyup.enter="searchCompany"> <p>{{ mtrilCode }}</p></InputText>
                    </div>
                    <button @click="searchCompany"class="btn btn-primary search-btn" >조회</button>
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
                <button @click="selectMt" class="btn btn-primary">확인</button>
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

//부모 컴포넌트로 데이터 보내기
const emit = defineEmits(["mtSelectedData"]);


//검색조건
let mtrilName = null;
let mtrilCode = null;

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
    mtrilName = null;
    mtrilCode = null;
}

//모달 자재를 선택하고 확인버튼 클릭
const selectMt = () => {
    modalOpen()
    const selectedNodes = gridApi.value.getSelectedNodes();
    const mtSelectedData = selectedNodes.map((node) => node.data);

    //console.log('모달에서 선택된 행 데이터:', mtSelectedData);

    emit("mtSelectedData", mtSelectedData);
};
//행 데이터를 담을 변수
const rowData = ref([]);

//열 정보: 번호, 발주명, 거래처코드, 거래처명, 선택
const ColDefs = [
  { field: "mtril_code", headerName: "자재코드", flex:1},
  { field: "mtril_name", headerName: "자재명", flex:1},
  { field: "unit", headerName: "단위", flex:1},
  { headerName : "선택",  checkboxSelection: true, flex:0.4}
];

const GridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
};

const searchCompany = async() => {
    //서버로 보낼 검색 데이터
    let obj = {mtril_code: mtrilCode,
                mtril_name: mtrilName};
    //console.log("새로만든 객체: ",obj);
    let result = await axios.post(`${ajaxUrl}/mtril/searchMt`, obj)
                            .catch(err=>console.log(err));

    //console.log("통신결과: ",result);
    //행 데이터 담기
    rowData.value = result.data;   
};

</script>

<style scoped>
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
    width: 34%;
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
.search-bar {
    padding: 27px;
    padding-bottom: 0px;
    background-color: #e3e3e3;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    border: 1px solid #ccc;
}
.search-bar span {
    margin: 15px;
    display: inline-block;
    width: 100px;
}
.search-bar div {
    text-align: left;
}
.modal-btn {
    display: table;
    margin: 0 auto;
}

.modal-btn button {
    margin: 10px 10px;
}

</style>