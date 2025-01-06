<template>
    <span style="margin-left:20px">
        <button type="button" @click="modalOpen"
        class="btn btn-primary"
        style="line-height: 1px; color: #fff;" v-if="state == 'pdf'">PDF 내보내기</button>
        <button type="button" @click="modalOpen"
        class="btn btn-primary"
        style="line-height: 1px; color: #fff;" v-else-if="state == 'order'">발주건 조회</button>

        <div class="modal-wrap" @click="modalOpen" v-show="modalCheck">
        <div class="modal-container" @click.stop="">
            <div class="search-bar">
                <div>
                    <span>발주명 </span>
                    <InputText type="text" v-model="orderName" v-on:keyup.enter="searchOrder">> <p>{{ orderName }}</p></InputText><br>
                    <span>거래처명 </span>
                    <InputText type="text" v-model="company" v-on:keyup.enter="searchOrder"> <p>{{ company }}</p></InputText><br>
                    <span>담당자</span>
                    <InputText type="text" v-model="empName" v-on:keyup.enter="searchOrder"> <p>{{ empName }}</p></InputText>
                </div>
                <div>
                    <span>발주일 </span>
                    <InputText type="date" v-model="startOrderDate"> <p>{{ startOrderDate }}</p></InputText> -
                    <InputText type="date" v-model="endOrderDate"> <p>{{ endOrderDate }}</p></InputText><br>
                    <div> 
                        <span>납기일 </span>
                        <InputText type="date" v-model="startDedt"> <p>{{ startDedt }}</p></InputText> -
                        <InputText type="date" v-model="endDedt"> <p>{{ endDedt }}</p></InputText>
                    </div>
                </div>
                <div style="width: 100%; text-align: center;">
                    <button @click="removeSearchKey"class="btn btn-secondary search-btn" >초기화</button>
                    <button @click="searchOrder"class="btn btn-primary search-btn" >조회</button>
                </div>
            </div>
            
            <AgGridVue 
                :rowData="orderRowData"
                :gridOptions="GridOptions"
                class="ag-theme-alpine"
                style="height: 518px"
                @grid-ready="onGridReady"
                >
            </AgGridVue>
            
            <div class="modal-btn" style="text-align: center;">
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

const props = defineProps(['state']);
let state = ref(props.state);

//부모 행 삭제를 위해서 사용하는 emit
const emit = defineEmits(["selectedData"]);

//검색조건
let orderName = ref(null);
let company = ref(null);
let startOrderDate = ref(null);
let endOrderDate = ref(null);
let startDedt = ref(null);
let endDedt = ref(null);
let empName = ref(null);

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
const modalOpen = async () => {
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
    
    //바로 검색
    await searchOrder();

    //검색조건 초기화
    orderName.value = "";
    company.value = "";
    startOrderDate.value = "";
    endOrderDate.value = "";
    startDedt.value = "";
    endDedt.value = "";
    empName.value = "";
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
  { field: "empl_name", headerName:"담당자", flex:0.5},
  { headerName : "선택",  checkboxSelection: true, flex:0.3}
];

const GridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      pagination: true,
      rowSelection: "single",
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
};

const searchOrder = async() => {
    //서버로 보낼 검색 데이터
    let obj = {order_name: orderName.value, 
               mtlty_name: company.value,
               start_order: startOrderDate.value,
               end_order: endOrderDate.value,
               start_dedt: startDedt.value,
               end_dedt: endDedt.value,
               emp_name: empName.value
                };
    console.log("새로만든 객체: ",obj);
    let result = [];
    if(state.value == "order") {
        result = await axios.post(`${ajaxUrl}/mtril/orderList`, obj)
                            .catch(err=>console.log(err));
    } else if(state.value == "pdf") {
        result = await axios.post(`${ajaxUrl}/mtril/allOrderListForPDF`, obj)
                            .catch(err=>console.log(err));
    };


    //console.log("통신결과: ",result);
    //행 데이터 담기
    orderRowData.value = result.data;   
};

//검색 데이터 삭제
const removeSearchKey = () => {
    orderRowData.value = []
    orderName.value = "";
    company.value = "";
    startOrderDate.value = "";
    endOrderDate.value = "";
    startDedt.value = "";
    endDedt.value = "";
    empName.value = "";
    
    //화면에 데이터 삭제 후 전체검색
    searchOrder();
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
    width: 50%;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
}

.modal-btn button {
    line-height: 1.1;
    margin: 10px 10px;
    text-align: center;
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
.search-bar div{
    display: inline-block;
    width: 420px;
}
.search-bar :first-child {
    text-align: left;
}
.search-bar>:first-child{
    position: relative;
    left: 1%;
}
.search-bar :first-child span {
    display: inline-block;
    width: 100px;
}
.search-bar span {
    margin: 12px 0;
}
.search-bar :nth-of-type(2) input {
    margin: 5px 0;
}
.search-bar>:nth-of-type(2){
    position: relative;
    top: -41px;
}
input[type="date"] {
    height: 40px; /* 높이를 명시적으로 지정 */
    padding: 5px; /* 내부 여백 추가 */
    box-sizing: border-box; /* 패딩 포함 크기 조정 */
    vertical-align: middle; /* 세로 정렬 */
    line-height: normal; /* 줄 높이 초기화 */
}
</style>