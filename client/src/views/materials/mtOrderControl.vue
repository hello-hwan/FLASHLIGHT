<template>
    <div>
        <span>발주 요청</span>
        <AgGridVue 
        :rowData="reqRowData"
        :gridOptions="reqGridOptions"
        rowSelection="multiple"
        class="ag-theme-alpine"
        @grid-ready="onGridReady"
        style="height: 300px"

        >
        </AgGridVue>

        <div style="margin: 20px; text-align: right">
            <span>
                <span>발주명</span>
                <InputText type="text" v-model="orderName" class="emp_info"> <p>{{ orderName }}</p></InputText>
                <span>거래처 명</span>
                <InputText type="text" v-model="company" class="emp_info" > <p>{{ company }}</p></InputText>
                <span>담당자</span>
                <InputText type="text" v-model="empId" class="emp_info"readonly> <p>{{ empId }}</p></InputText>
            </span>
     
            <span class="align-left">
                 <button type="button" class="btn btn-primary"
                 @click="getOrderRowData"
                 style="line-height: 1px; color: #fff;">
                 선택항목 발주서 작성 </button>
                 
                 <!--검색 모달 열기-->
                 <searchModal @selectedData="getOrderDetails"/> 
             </span>
        </div>

       <div>발주 자재 목록</div>
       <AgGridVue 
        :rowData="orderRowData"
        :gridOptions="mtListGridOptions"
        rowSelection="multiple"
        class="ag-theme-alpine"
        @grid-ready="mtListonGridReady"
        style="height: 600px"
        >
        </AgGridVue>
        <div style="margin: 10px">
            <button type="button" @click="addRow"
            class="btn btn-primary"
           style="line-height: 1px; color: #fff;">행 추가</button>
            
           <button type="button" @click="removeRow"
            class="btn btn-warning"
           style="line-height: 1px; color: #fff;">행 삭제</button>
           
           <button type="button" @click="removeAllRow"
            class="btn btn-secondary"
           style="line-height: 1px; color: #fff;">초기화</button>
        </div>
    </div>

</template>


<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { ref, watch } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import useDateUtils from '@/utils/useDates.js';
import { useToast } from 'primevue/usetoast';
import searchModal from '@/components/materials/orderControlModal.vue';

const toast = useToast();

//요청명리스트 담을 변수
const reqRowData = ref([]);

//발주서에 등록할 데이터를 담을 변수
const orderRowData = ref([]);

//발주명
let orderName = "";
//거래처 명
let company = "";
//담당자
let empId = 100;

//자식 컴포넌트로부터 받은 데이터 담을 변수
let orderCode = ref("");

//자식 컴포넌트로부터 받은(선택한) 데이터
const getOrderDetails = (info) => {
    orderCode.value = info[0].order_code;
};


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
  { field: "req_code", headerName:"요청 코드",flex:3},
  { field: "req_name", headerName:"요청 명" },
  { field: "mt_code", headerName:"자재 코드" },
  { field: "mt_name", headerName:"자재 명",flex:3},
  { field: "req_qy", headerName:"요청 수량" ,flex:3},
  { field: "unit", headerName:"단위", flex:1},
  { field: "date", headerName:"요청날짜", valueFormatter: customDateFormat,flex:3},
  { field: "check", headerName:"선택",  checkboxSelection: true, flex: 0.7}
];

const mtListColDefs = [
    { field: "mt_name", headerName: "*자재명", editable: true},
    { field: "mt_code", headerName: "*자재코드", editable: true},
    { field: "price", headerName: "입고단가(원)", editable: true},
    { field: "order_qy", headerName: "*수량", editable: true},
    { field: "unit", headerName: "*단위", editable: true},
    { field: "order_date", headerName: "*발주일", valueFormatter: customDateToday},
    { field: "dedt", headerName: "*납기일", valueFormatter: (params) => {
          if (!params.value) {
            return "";
          }
          params.value = new Date(params.value);
          const month = params.value.getMonth() + 1;
          const day = params.value.getDate();
          return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        },
        cellEditor: "agDateCellEditor", editable: true }
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
};

//watch사용. 선택한 발주건 발주코드 값이 변할때마다 처리해야함.
watch(() => orderCode.value, async(newVal) => {
    //console.log("선택된값",orderCode.value);
    let result = await axios.get(`${ajaxUrl}/mtril/mtListOnOrder/${orderCode.value}`)
                      .catch(err=>console.log(err));

    //console.log("통신결과: ", result.data);
    //console.log(mtListGridApi.value);
    //mtListGridApi.value.applyTransaction({update: result.data});
    company = result.data[0].company_name;
    orderName = result.data[0].req_name;
    orderRowData.value = result.data;
    //console.log(orderRowData.value);
    //console.log(orderRowData.value);
    
});

//요청 자재 리스트 가져오기
const mtReqList = async() => {
    let result = await axios.get(`${ajaxUrl}/mtril/reqOrderList`)
                            .catch(err => console.log(err));
    //console.log('시작 결과',result.data);

    reqRowData.value = result.data;
    
};
mtReqList();
</script>

<style>
.emp_info {
  width: 100px;
  margin-right: 20px;
}

.btn {
    margin-left: 10px;
}
</style>