<template>
    <span style="margin-left:20px">
        <span>거래처 명 </span>
        <InputText type="text" class="emp_info" @click="modalOpen" readonly placeholder="거래처 명을 입력해주세요" v-model="companyName" style="height:38px;">{{ companyName }}</InputText>
        <div style="display: none;">
            <span>거래처 코드</span>
            <InputText type="text" class="emp_info" @click="modalOpen"readonly placeholder="거래처 코드를 입력해주세요" v-model="companyCode">{{ companyCode }}</InputText>
        </div>

        <div class="modal-wrap" @click="modalOpen" v-show="modalCheck">
        <div class="modal-container" @click.stop="">
            <div class="search-bar">
                <div>         
                    <div>
                        <span>거래처 코드 </span>
                        <InputText type="text" v-model="searchCompanyCode" v-on:keyup.enter="searchCompany"> <p>{{ searchCompanyCode }}</p></InputText>
                    </div> 
                    <div>
                        <span>상호명 </span>
                        <InputText type="text" v-model="searchcompanyName" v-on:keyup.enter="searchCompany"> <p>{{ searchcompanyName }}</p></InputText>
                    </div>
                    <div>
                        <span>담당자 명 </span>
                        <InputText type="text" v-model="searchchargerName" v-on:keyup.enter="searchCompany"> <p>{{ searchchargerName }}</p></InputText>
                    </div>
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

import { ref, watch } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

//부모 컴포넌트로 데이터 보내기
const emit = defineEmits(["companySelectedData"]);

//화면에 보이는 데이터
let companyName = ref(null);
let companyCode = ref(null);

//검색조건
let searchCompanyCode = null;
let searchcompanyName = null;
let searchchargerName = null;

//부모로 부터 받은 회사 정보
const props = defineProps(['companyInfo']);

//부모로 부터 받은 값이 바뀌면(거래처 상호명, 거래처 코드)
watch(() => props.companyInfo, (newValue) => {
    console.log(newValue);
    console.log("회사코드", newValue.company_code);
    console.log("회사명", newValue.company_name);
    //부모 컴포넌트의 회사명, 회사코드가 바뀌면 새로운 값이 할당됨
    companyName.value = newValue.company_name;
    companyCode.value = newValue.company_code;
});
/* 
객체를 받기때문에 () => ...의 형태로 한번 더 싸는 깊은 복사의 형태가 돼야함.
그렇지 않으면 watch에서 감지안됨.
watch(() => props.companyInfo.company_code, (newValue) => {
    console.log('회사코드: ', newValue);
});
watch(() => props.companyInfo.company_name, (newValue) => {
    console.log('회사명: ', newValue);
});
*/


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

//모달 발주건을 선택하고 확인버튼 클릭
const selectOrder = () => {
    modalOpen()
    const selectedNodes = gridApi.value.getSelectedNodes();
    const companySelectedData = selectedNodes.map((node) => node.data);
    console.log('모달에서 선택된 행 데이터:', companySelectedData);
    companyName.value = companySelectedData[0].mtlty_name;
    companyCode.value = companySelectedData[0].bcnc_code;

    //console.log(companyName, companyCode);
    companyName.value = companySelectedData[0].mtlty_name;
    companyCode.value = companySelectedData[0].bcnc_code;
    emit("companySelectedData", companySelectedData);
};
//행 데이터를 담을 변수
const rowData = ref([]);

//열 정보: 번호, 발주명, 거래처코드, 거래처명, 선택
const ColDefs = [
  { field: "bcnc_code", headerName: "거래처 코드", flex: 0.5},
  { field: "mtlty_name", headerName: "거래처 명", flex: 1},
  { field: "charger_name", headerName: "거래처 담당자", flex: 0.7},
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
    width: 40%;
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
.search-bar>div div{
    text-align: left;
}
.search-bar>div div span {
    display:inline-block;
    margin: 15px 0;
    width: 100px;
}
input{
    width: 310px;
}
.modal-btn{
    text-align: center;
    margin: 0 10px;
}
.modal-btn button[data-v-043d30f2] {
    line-height: 1.1;
    margin: 10px 10px;
}
</style>