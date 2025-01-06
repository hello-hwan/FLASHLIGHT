<template>
    <div class="col-2">
        <label for="orderFormMtltyName" class="col-form-label">거래처 명</label>
    </div>
    <div class="col-auto">
        <input type="text" id="orderFormMtltyName" class="form-control"  @click="modalOpen" v-model="companyName" readonly>
    </div>
    <div class="col-2">
        <label for="orderFormMtltyCode" class="col-form-label">거래처 코드</label>
    </div>
    <div class="col-auto">
        <input type="text" id="orderFormMtltyCode" class="form-control"  @click="modalOpen" v-model="companyCode" readonly>
    </div>
    
    <span style="margin-left:20px; margin-bottom:0; margin-top:0;">

        <div class="modal-wrap" @click="modalOpen" v-show="modalCheck" >
        <div class="modal-container" @click.stop="">
            <div id="search-bar">
                <div class="align-left"> 
                    <span>거래처 코드</span>
                    <InputText type="text" v-model="searchCompanyCode" v-on:keyup.enter="searchCompany"> <p>{{ searchCompanyCode }}</p></InputText>
                    <span>거래처 명</span>
                    <InputText type="text" v-model="searchcompanyName" v-on:keyup.enter="searchCompany"> <p>{{ searchcompanyName }}</p></InputText>
                    <span>담당자 명</span>
                    <InputText type="text" v-model="searchchargerName" v-on:keyup.enter="searchCompany"> <p>{{ searchchargerName }}</p></InputText>
                </div>
                <div style="display:flex; justify-content: center;">
                    <button @click="searchCompany"class="btn btn-primary search-btn" >조회</button>
                </div>
            </div>
            
            <AgGridVue 
                :rowData="rowData"
                :gridOptions="GridOptions"
                class="ag-theme-alpine"
                style="height: 500px"
                @grid-ready="onGridReady"
                rowSelection="single"
                overlayNoRowsTemplate="결과 없음"
                >
            </AgGridVue>
            
            <div class="modal-btn" style="display:flex; justify-content: center;">
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

import { useToast } from 'primevue/usetoast';
const toast = useToast();

//부모 컴포넌트로 데이터 보내기
const emit = defineEmits(["companySelectedData"]);

const props = defineProps(['info']);
//console.log(props);
console.log('출력확인!!!!!!!!!!!!!!!!!!!!', props.info);

//화면에 보이는 데이터
let companyName = null;
let companyCode = null;

if (props.info != null){
    companyName = props.info.mtltyName;
    companyCode = props.info.pCode;
}

//검색조건
let searchCompanyCode = null;
let searchcompanyName = null;
let searchchargerName = null;

//그리드 api를 담을 변수
const gridApi = ref(null);

//grid가 생성될때 발생한 ag grid의 api를 변수에 담음
const onGridReady = (params) => { 
    gridApi.value = params.api; 
}; 

//모달 열림 상태 담을 변수
let modalCheck = ref(false);

//모달이 열리면 true로 변경, 스크롤 막기
let modalOpen = async() => {
    
    let html = document.querySelector('html');
    if(modalCheck.value == false) {
        modalCheck.value = !modalCheck.value;
        html.style.overflow = 'hidden';
    } else {
        modalCheck.value = !modalCheck.value;
        html.style.overflow = 'auto';
    };
    //행 데이터 초기화
    rowData.value = [];
    
    await searchCompany();
    //검색조건 초기화
    searchCompanyCode = null;
    searchcompanyName = null;
    searchchargerName = null;
}

//모달 발주건을 선택하고 확인버튼 클릭
const selectOrder = () => {
    modalOpen()
    const selectedNodes = gridApi.value.getSelectedNodes();
    const companySelectedData = selectedNodes.map((node) => node.data);
    console.log(companySelectedData);
    if (companySelectedData[0] != null){
        console.log('모달에서 선택된 행 데이터:', companySelectedData);
        companyName = companySelectedData[0].mtlty_name;
        companyCode = companySelectedData[0].bcnc_code;
        
        console.log(companyName, companyCode);
        emit("companySelectedData", companySelectedData);
    } else {
        toast.add({ severity: 'warn', summary: '실패', detail: '거래처가 선택되지 않았습니다.', life: 3000 });
    }
};
//행 데이터를 담을 변수
const rowData = ref([]);

//열 정보: 번호, 발주명, 거래처코드, 거래처명, 선택
const ColDefs = [
  { field: "bcnc_code", headerName: "거래처 코드", flex:1},
  { field: "mtlty_name", headerName: "거래처 명", flex:1},
  { field: "charger_name", headerName: "담당자 명", flex:1},
  { headerName : "선택",  checkboxSelection: true, flex:0.3}
];

const GridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
};

const searchCompany = async() => {
    console.log('작동');
    //서버로 보낼 검색 데이터
    let obj = {company_code: searchCompanyCode,
                company_name: searchcompanyName,
                charger_name: searchchargerName
            };
    //console.log("새로만든 객체: ",obj);
    let result = await axios.post(`${ajaxUrl}/business/searchCompany`, obj)
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
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
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
input {
    width: 220px;
}
button{
    margin-left : 5px;
    margin-right: 5px;
    line-height: 15px;
}
</style>