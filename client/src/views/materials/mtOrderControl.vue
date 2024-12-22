<template>
    <div>
        <span>발주 요청</span>
        <AgGridVue 
        :rowData="reqRowData"
        :gridOptions="reqGridOptions"
        rowSelection="multiple"
        class="ag-theme-alpine"
        domLayout="autoHeight"
        @grid-ready="onGridReady"
        >
        </AgGridVue>

        <button type="button" class="btn btn-primary"
       @click="getOrderRowData"
       style="line-height: 1px; color: #fff;">
       선택항목 발주서 작성 </button>
       <div>
           <span>발주명</span>
           <InputText type="text" v-model="orderName" class="emp_info"> <p>{{ orderName }}</p></InputText>
           <span>담당자</span>
           <InputText type="text" v-model="company" class="emp_info"> <p>{{ company }}</p></InputText>
           <span>거래처 명</span>
           <InputText type="text" v-model="empId" class="emp_info" readonly> <p>{{ empId }}</p></InputText>
       </div>

       <div>발주 자재 목록</div>
       <AgGridVue 
        :rowData="orderRowData"
        :gridOptions="mtListGridOptions"
        rowSelection="multiple"
        class="ag-theme-alpine"
        domLayout="autoHeight"
        @grid-ready="mtListonGridReady"
        style="height: 600px"
        >
        </AgGridVue>

        <button type="button" @click="addRow"
        class="btn btn-primary"
       style="line-height: 1px; color: #fff;">행 추가</button>
        
       <button type="button" @click="removeRow"
        class="btn btn-primary"
       style="line-height: 1px; color: #fff;">행 삭제</button>
       
       <button type="button" @click="removeAllRow"
        class="btn btn-primary"
       style="line-height: 1px; color: #fff;">초기화</button>
    </div>

</template>


<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { ref } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import useDateUtils from '@/utils/useDates.js';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

//요청명리스트 담을 변수
const reqRowData = ref([]);

//발주서에 등록할 데이터를 담을 변수
const orderRowData = ref([]);

//발주명
const orderName = "";
//거래처 명
const company = "";
//담당자
const empId = 100;

//요청 자재 리스트 가져오기
const mtReqList = async() => {
    let result = await axios.get(`${ajaxUrl}/mtril/reqOrderList`)
                            .catch(err => console.log(err));
    console.log(result.data);
    reqRowData.value = result.data;

};
mtReqList();
//날짜 포멧
const customDateFormat = (params) => {
  //console.log(params);
  return useDateUtils.dateFormat(params.values, 'yyyy-MM-dd');
};

const customDateToday = () => {
    return useDateUtils.dateFormat(new Date(), 'yyyy-MM-dd');
}

//요청 열 정보 자재명, 자재코드, 요청수량, 단위, 요청날짜
const reqColDefs = [
  { field: "mt_name", headerName:"자재명",flex:3},
  { field: "mt_code", headerName:"자재코드" },
  { field: "req_qy", headerName:"요청수량" ,flex:3},
  { field: "unit", headerName:"단위", flex:1},
  { field: "date", headerName:"요청날짜", valueFormatter: customDateFormat},
  { field: "check", headerName:"선택",  checkboxSelection: true, flex: 0.7}
];

const mtListColDefs = [
    { field: "mt_name", headerName: "자재명", editable: true},
    { field: "mt_code", headerName: "자재코드", editable: true},
    { field: "field1", headerName: "거래처 명", editable: true},
    { field: "field2", headerName: "입고단가(원)", editable: true},
    { field: "req_qy", headerName: "수량", editable: true},
    { field: "unit", headerName: "단위", editable: true},
    { field: "field3", headerName: "발주일", valueFormatter: customDateToday, editable: true},
    { field: "field4", headerName: "납기일", editable: true}
]

//ag grid 요청테이블 옵션 설정
const reqGridOptions = {
      columnDefs: reqColDefs,
      animateRows: false
};

//자재 목록 테이블 옵션 설정
const mtListGridOptions = {
    columnDefs: mtListColDefs,
    animateRows: false,
    paginationPageSize: 10
}
// params.api를 담을 변수
const gridApi = ref(null);

//grid가 생성될때 발생한 ag grid의 api를 변수에 담음
const onGridReady = (params) => {
    gridApi.value = params.api;
};

const mtListGridApi = ref(null);
const mtListonGridReady = (params) => {
    mtListGridApi.value = params.api;
}

//선택된 행 데이터를 버튼을 클릭했을때 가져옴
const getOrderRowData = () => {
      const selectedNodes = gridApi.value.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data);
      console.log('선택된 행 데이터:', selectedData);
      orderRowData.value = selectedData;
    };

//행 추가
const addRow = () => {
    //행추가할 객체 생성
    let obj = {mt_name: "", mt_code: "", field1: "", field2: "", 
    req_qy: "", unit: "", field3: "", field4: ""};

    //add:[]배열안에 객체 형태로 데이터를 넣으면 됨.
    mtListGridApi.value.applyTransaction({add: [obj]});
};

//행 삭제
const removeRow = () => {
    //전체 행 데이터를 저장할 (객체)배열 선언
    let allData = [];
    // 현재 모든 행 데이터 가져오기
    mtListGridApi.value.forEachNode((node) => allData.push(node.data));
    if (allData.length > 0) {
        //마지막 행 데이터를 가져와서 삭제함.
        let lastRow = allData[allData.length - 1];
        mtListGridApi.value.applyTransaction({ remove: [lastRow] });
    } else {
        toast.add({ severity: 'warn', summary: '행 삭제', detail: '삭제할 행이 없습니다.', life: 3000 });

    };
};

//행 전체 삭제
const removeAllRow = () => {
    //전체 행 데이터를 저장할 (객체)배열 선언
    let allData = [];

    // 현재 모든 행 데이터 가져오기
    mtListGridApi.value.forEachNode((node) => allData.push(node.data));

    //행데이터 모두 삭제
    for(let i=0; i<allData.length; i++) {
        let row = allData[i];
        mtListGridApi.value.applyTransaction({ remove: [row] });
    };
}
</script>

<style>
.emp_info {
  width: 100px;
  margin-right: 20px;
}
</style>