<template>
    <span style="margin-left:20px">
        <button type="button" @click="modalOpen"
        class="btn btn-primary"
        style="line-height: 1px; color: #fff;">발주건 조회</button>

        <div class="modal-wrap" @click="modalOpen" v-show="modalCheck">
        <div class="modal-container" @click.stop="">
            <div id="search-bar">
                <div class="align-left">                
                    <span>발주명</span>
                    <InputText type="text" v-model="orderName" v-on:keyup.enter="searchOrder">> <p>{{ orderName }}</p></InputText>
                    <span>발주일</span>
                    <InputText type="date" v-model="startOrderDate"> <p>{{ startOrderDate }}</p></InputText> -
                    <InputText type="date" v-model="endOrderDate"> <p>{{ endOrderDate }}</p></InputText>
    
                </div>
                <div class="align-left">
                    <span>거래처명</span>
                    <InputText type="text" v-model="company" v-on:keyup.enter="searchOrder"> <p>{{ company }}</p></InputText>
                    <span>납기일</span>
                    <InputText type="date" v-model="startDedt"> <p>{{ startDedt }}</p></InputText> -
                    <InputText type="date" v-model="endDedt"> <p>{{ endDedt }}</p></InputText>
                </div>
                <div>
                    <span>사원번호</span>
                    <InputText type="text" v-model="empId" v-on:keyup.enter="searchOrder"> <p>{{ empId }}</p></InputText>
                </div>
                <button @click="searchOrder"class="btn btn-primary search-btn" >조회</button>
            </div>
            
            <AgGridVue 
                :rowData="orderRowData"
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
const emit = defineEmits(["selectedData"]);

//검색조건
let orderName = null;
let company = null;
let startOrderDate = null;
let endOrderDate = null;
let startDedt = null;
let endDedt = null;
let empId = null;

//날짜 포멧
const customDateFormat = (params) => {
    if (!params.value) {
        return "";
    }
    if(typeof(params.value) != Date) {
        params.value = new Date(params.value);
    }
    const month = params.value.getMonth() + 1;
    const day = params.value.getDate();
    return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
};

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
    orderRowData.value = [];
    
    //검색조건 초기화
    orderName = null;
    company = null;
    startOrderDate = null;
    endOrderDate = null;
    startDedt = null;
    endDedt = null;
    empId = null;
}

//모달 발주건을 선택하고 확인버튼 클릭
const selectOrder = () => {
    modalOpen()
    const selectedNodes = gridApi.value.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    console.log('선택된 행 데이터:', selectedData);
    emit("selectedData", selectedData);
};
//행 데이터를 담을 변수
const orderRowData = ref([]);

//열 정보: 번호, 발주명, 거래처코드, 거래처명, 선택
const ColDefs = [
  { field: "order_no", headerName: "발주번호", hide: true, suppressToolPanel: true},
  { field: "order_code", headerName: "발주코드", hide: true, suppressToolPanel: true},
  { field: "order_name", headerName: "발주명"},
  { field: "bcnc_code", headerName:"거래처 코드", hide: true, suppressToolPanel: true },
  { field: "mtlty_name", headerName:"거래처 명"},
  { field: "order_date", headerName: "발주일", valueFormatter:customDateFormat, flex:0.8},
  { field: "dedt", headerName: "납기일", valueFormatter: customDateFormat, flex:0.8},
  { field: "empl_no", headerName:"담당자", flex:0.5},
  { headerName : "선택",  checkboxSelection: true, flex:0.3}
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
    let obj = {order_name: orderName, 
               mtlty_name: company,
               start_order: startOrderDate,
               end_order: endOrderDate,
               start_dedt: startDedt,
               end_dedt: endDedt,
               emp_id: parseInt(empId) 
                };
    console.log("새로만든 객체: ",obj);
    let result = await axios.post(`${ajaxUrl}/mtril/orderList`, obj)
                            .catch(err=>console.log(err));

    //console.log("통신결과: ",result);
    //행 데이터 담기
    orderRowData.value = result.data;   
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