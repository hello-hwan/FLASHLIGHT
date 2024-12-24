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
                <span style="display:none">
                    <span>거래처 코드</span>
                    <InputText type="text" v-model="company" class="emp_info" > <p>{{ company }}</p></InputText>
                </span>
                <span>담당자</span>
                <InputText type="text" v-model="empId" class="emp_info"readonly> <p>{{ empId }}</p></InputText>
            </span>
     
            <div class="align-left">
                 <button type="button" class="btn btn-primary"
                 @click="getOrderRowData"
                 style="color: #fff;">
                 선택항목 발주서 작성 </button>
                 
                 <!--검색 모달 열기-->
                 <searchModal @selectedData="getOrderDetails"/> 
            </div>
            <button type="button" class="btn btn-danger"
                 style="color: #fff; margin-left: 30px" v-show="delBtn">발주삭제</button>
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
        <div class="btnGroup"style="">
            <button type="button" @click="addRow"
            class="btn btn-primary">행 추가</button>
            
           <button type="button" @click="removeRow"
            class="btn btn-warning">행 삭제</button>
           
           <button type="button" @click="removeAllRow"
            class="btn btn-secondary">초기화</button>

           <button type="button" @click="insertMtOrderList"
            class="btn btn-primary" v-if="orderCode == ''">등록</button>
           <button type="button" @click="insertMtOrderList"
            class="btn btn-primary" v-else>수정</button>
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

let delBtn = ref(false);

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

//요청 리스트 열 정보
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

//자재 리스트 열 정보
const mtListColDefs = [
    { field: "req_code", headerName:"요청 코드", hide: true, suppressToolPanel: true, flex:3},
    { field: "mt_name", headerName: "*자재명", editable: true},
    { field: "mt_code", headerName: "*자재코드", editable: true},
    { field: "price", headerName: "입고단가(원)", editable: true},
    { field: "order_qy", headerName: "*수량", editable: true},
    { field: "unit", headerName: "*단위", editable: true},
    { field: "order_date", headerName: "*발주일", valueFormatter: customDateToday, cellDataType: "date"},
    { field: "dedt", headerName: "*납기일", valueFormatter: (params) => {
        //cusomDateFormat으로 해결이 안되어 직접 작성
          if (!params.value) {
            return "";
          }
          params.value = new Date(params.value);
          const month = params.value.getMonth() + 1;
          const day = params.value.getDate();
          return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        },
        cellEditor: "agDateCellEditor", cellDataType: "date", editable: true }
];

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
};
// params.api를 담을 변수
const gridApi = ref(null);

//grid가 생성될때 발생한 ag grid의 api를 변수에 담음
const onGridReady = (params) => {
    gridApi.value = params.api;
};

//자재 리스트 grid api담기 위한 변수
const mtListGridApi = ref(null);

//자재 리스트 gridapi가져오기
const mtListonGridReady = (params) => {
    mtListGridApi.value = params.api;
};

//선택된 행 데이터를 버튼을 클릭했을때 가져옴
const getOrderRowData = () => {
      const selectedNodes = gridApi.value.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data);
      
      //행에 데이터 넣기
      orderRowData.value = selectedData;   
};

//행 추가
const addRow = () => {
    //행추가할 객체 생성
    let obj = {req_code: "", mt_name: "", mt_code: "", price: "", order_qy: "", 
    unit: "", order_date: "", dedt: ""};

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
        //삭제불가 안내
        toast.add({ severity: 'warn', summary: '행 삭제', detail: '삭제할 행이 없습니다.', life: 3000 });
    };

    //버튼을 클릭했을때 배열의 길이가 0이라면 그때도 수정버튼을 클릭할 수 있음. 그래서 행을 모두 삭제하고 나서 바로 수정버튼으로 바뀌게 함.
    if(allData.length-1 == 0) {
        //수정버튼 상태 변경 
        orderCode.value = '';
    }
    //삭제버튼 비활성화
    delBtn.value = false;
};

//행 전체 삭제
const removeAllRow = () => {
    //전체 행 데이터를 저장할 (객체)배열 선언
    let allData = [];

    // 현재 모든 행 데이터 가져오기
    mtListGridApi.value.forEachNode((node) => allData.push(node.data));

    //행데이터 모두 삭제
    for(let i=0; i<allData.length; i++) {
        //열번호 가져오기
        let row = allData[i];
        //삭제
        mtListGridApi.value.applyTransaction({ remove: [row] });
    };
    //삭제버튼 비활성화
    delBtn.value = false;
    //수정버튼 상태 변경
    orderCode.value = '';
};

//watch사용. 선택한 발주건 발주코드 값이 변할때마다 처리해야함.
watch(() => orderCode.value, async(newVal) => {
    //console.log("선택된값",orderCode.value);
    let result = await axios.get(`${ajaxUrl}/mtril/mtListOnOrder/${orderCode.value}`)
                      .catch(err=>console.log(err));
    //거래처명, 주문명 인풋박스에 넣기
    company = result.data[0].company_name;
    orderName = result.data[0].req_name;
    
    //행 데이터 넣기
    orderRowData.value = result.data;

    //삭제버튼 활성화
    delBtn.value = true;
});

//요청 자재 리스트 가져오기
const mtReqList = async() => {
    let result = await axios.get(`${ajaxUrl}/mtril/reqOrderList`)
                            .catch(err => console.log(err));
    //요청 행에 데이터 넣기
    reqRowData.value = result.data;
    
};
mtReqList();

//자재 등록
const insertMtOrderList = () => {
    let rowData = [];
    //각 행의 데이터를 가져와서 rowData배열에 푸쉬(객체의 배열 형식)
    mtListGridApi.value.forEachNode((node) => rowData.push(node.data));

    //유효성 검사
    for(let i=0; i<rowData.length; i++) {
        rowData[i].order_date = customDateToday();

        //dedt db에 넣을수 있는 포멧으로 바꾸기
        rowData[i].dedt = new Date(rowData[i].dedt);
        let month = rowData[i].dedt.getMonth() + 1;
        let day = rowData[i].dedt.getDate();
        rowData[i].dedt = `${rowData[i].dedt.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

        rowData[i].order_qy = parseInt(rowData[i].order_qy);

        //수량 입력이 잘못됐을 경우 오류 출력
        if(!(parseInt(rowData[i].order_qy) > 0)) {
            toast.add({ severity: 'warn', summary: '입력 오류', detail: '주문수량을 확인해주세요.', life: 3000 });
            return;
        };

        if(orderName == "" || company == "") {
            //발주명, 거래처명 이 비어있으면 오류
            toast.add({ severity: 'warn', summary: '입력 오류', detail: '발주명, 거래처 명을 확인해주세요.', life: 3000 });

        } else if (rowData[i].dedt == "" || rowData[i].order_qy == "" ) {
            //납기일, 주문수량이 비어 있거나, 주문수량이 숫자가 아니면 오류 메세지 출력

            toast.add({ severity: 'warn', summary: '입력 오류', detail: '주문수량, 납기일을 확인해주세요.', life: 3000 });

        } else if (orderName.length > 20) {
            //발주명이 20자 이상이면 오류
            toast.add({ severity: 'warn', summary: '입력 오류', detail: '발주명은 20자 이하로 작성해주세요.', life: 3000 });

        } else {
            
        };
    };
    console.log(rowData);
};

</script>

<style>
.emp_info {
  width: 100px;
  margin-right: 20px;
}

.btn {
    margin-left: 10px;
    --bs-btn-line-height: 1;
}
.btnGroup{
    margin: 10px;
}
.btnGroup{
    line-height: 1px; 
    color: #fff;
}
</style>