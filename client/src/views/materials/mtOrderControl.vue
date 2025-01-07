<template>
    <div>
        <v-card class="mx-auto card-custom-1" style="border-radius:13px; text-align: center;">
            <template v-slot:title>
                <span class="font-weight-black">
                    발주 관리
                </span>
            </template>
        </v-card>
        <div class="top-btn">            
            <span>
                <button type="button" class="btn btn-primary"
                style="color: #fff;" @click="openReq" v-if="checkForReqMt">요청 자재 목록 닫기</button>
                <button type="button" class="btn btn-primary"
                style="color: #fff;" @click="openReq" v-else>요청 자재 목록 보기</button>
                <button type="button" class="btn btn-danger"
                style="color: #fff; margin-left: 30px" v-show="delBtn" @click="delOrder">발주삭제</button>
                <!--발주건 조회-->
                <orderSearchModal v-bind:state="forSearchOrder" @selectedData="getOrderDetails"/> 
            </span>
        </div>
        <!--요청 자재 목록-->
        <div v-show="checkForReqMt">
    
            <v-card
                class="mx-auto"
                style="margin-top: 30px; border-radius:13px;">
            
                <v-card-text class="bg-surface-light pt-4">
                    <button type="button" class="btn btn-primary select-req-mt"
                         @click="getOrderRowData"
                         style="color: #fff">
                         선택항목 발주서 작성 </button>
                    <!--ag grid영역-->
                    <AgGridVue 
                    :rowData="reqRowData"
                    :gridOptions="reqGridOptions"
                    rowSelection="multiple"
                    class="ag-theme-alpine"
                    @grid-ready="onGridReady"
                    style="height: 516px;"
                    overlayNoRowsTemplate="결과 없음">
                    </AgGridVue>
                </v-card-text>
            </v-card>
        </div>

        <v-card style="margin-top: 30px; border: 1px solid #ccc;">
            
            <div style="margin: 20px; text-align: right;">

        
                <div class="align-left">
                    <!--검색 모달 열기-->
                    <div class="search-order-modal-Btn">
                        
                    </div>
                    <span>
                        <span>발주명 </span>
                        <InputText type="text" v-model="orderName" class="emp_info" placeholder="   발주명을 입력해주세요"> <p>{{ orderName }}</p></InputText>
                        <companySearchModal v-bind:companyInfo="companyInfoForChildComponent" @companySelectedData="getCompanyInfo"/> 
                        <span>담당자 </span>
                        <InputText style="width: 100px;" type="text" v-model="empName" class="emp_info"readonly> <p>{{ empName }}</p></InputText>
                        <InputText style="display: none;" type="text" v-model="empId" class="emp_info"readonly> <p>{{ empId }}</p></InputText>
                        <mtSearchModal @mtSelectedData="addRow"/>
                            
                        <button type="button" @click="removeRow"
                        class="btn btn-danger" style="color: #fff;"> 선택 행 삭제</button>
                        
                        <button type="button" @click="removeAllRow"
                        class="btn btn-secondary" style="color: #fff;">초기화</button>

                        <button type="button" @click="insertMtOrderList"
                        class="btn btn-primary" style="color: #fff;" v-if="orderCode == ''">등록</button>
                        <button type="button" @click="insertMtOrderList"
                        class="btn btn-primary" style="color: #fff;" v-else>수정</button>
                    </span>
                </div>

            </div>
            <v-card-text class="bg-surface-light pt-4">
                <AgGridVue 
                    :rowData="orderRowData"
                    :gridOptions="mtListGridOptions"
                    rowSelection="multiple"
                    class="ag-theme-alpine"
                    @grid-ready="mtListonGridReady"
                    style="height: 520px"
                    overlayNoRowsTemplate="자재를 추가해주세요"
                    >
                    </AgGridVue>
            </v-card-text>

        </v-card>
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
const toast = useToast();

import { useStore } from 'vuex'; // Vuex 스토어 가져오기
const store = useStore();

import { useRouter } from 'vue-router'
const router = useRouter();


//발주건 검색 모달
import orderSearchModal from '@/components/materials/orderControlModal.vue';

//거래처 검색 모달
import companySearchModal from '@/components/materials/searchCompanyModal.vue';

//자재 검색 모달
import mtSearchModal from '@/components/materials/searchMtModal.vue';

//search order modal을 위해서 상태값 넘기기
let forSearchOrder = 'order';



//요청명리스트 담을 변수
const reqRowData = ref([]);

//발주서에 등록할 데이터를 담을 변수
const orderRowData = ref([]);

//모달에서 선택한 데이터를 저장해두는 변수. 수정할 때 수정된 데이터와 비교하기 위해 저장함.
let orderDataFromDb = ref([]);

//발주명
let orderName = "";
//거래처 명
let companyName = "";
//거래처 코드
let companyCode = "";
//담당자
let empId = store.state.empInfo[store.state.empInfo.length-1].user_id;

let empName = store.state.empInfo[store.state.empInfo.length-1].name;
//console.log(empId);
//자식 컴포넌트로부터 받은 데이터 담을 변수
const orderCode = ref("");

const delBtn = ref(false);

//발주 요청목록 확인을 위한 변수
const checkForReqMt = ref(false);

const openReq = () => {
    checkForReqMt.value = !checkForReqMt.value;
};

//자식 컴포넌트로부터 받은(선택한) 데이터 (발주건)
const getOrderDetails = (info) => {
    orderCode.value = info[0].order_code;
    //자식 컴포넌트로 상호명, 거래처코드 넘겨주기

};
//자식 컴포넌트로 보낼 회사명, 코드를 담을 변수
let companyInfoForChildComponent = ref({company_name: "", company_code:""});

//회사 검색 모달에서 넘어오는 데이터 (상호명, 거래처 코드)
const getCompanyInfo = (info) => {
    //보이는 데이터는 자식 컴포넌트에 있음.
    //실제 db로 보내거나 사용하는 데이터는 emit으로 부모로 보내서 받음.
    companyName = info[0].mtlty_name;
    companyCode = info[0].bcnc_code;
};

//보이는 값을 바꾸기 위해서 자식 컴포넌트로 거래처 상호명, 코드를 v-bind로 전달함.

const sendCompanyInfo = (info) => {
    companyInfoForChildComponent.value = {company_name: info.data[0].company_name, 
                                            company_code: info.data[0].company_code};
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
  { field: "req_code", headerName:"요청 코드",flex:3, hide: true, suppressToolPanel: true, flex:3},
  { field: "req_name", headerName:"요청 명" },
  { field: "mt_code", headerName:"자재 코드" },
  { field: "mt_name", headerName:"자재 명",flex:3},
  { field: "order_qy", headerName:"요청 수량" ,flex:3},
  { field: "unit", headerName:"단위", flex:1},
  { field: "date", headerName:"요청날짜", valueFormatter: (params) => {
          if (!params.value) {
            return "";
          }
          params.value = new Date(params.value);
          const month = params.value.getMonth() + 1;
          const day = params.value.getDate();
          return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        }, flex:3},
  { field: "check", headerName:"선택",  checkboxSelection: true, flex: 0.7}
];

//자재 리스트 열 정보
const mtListColDefs = [
    { field: "order_no", headerName: "발주번호", hide: true, suppressToolPanel: true, flex:1},
    { field: "req_code", headerName:"요청 코드", hide: true, suppressToolPanel: true, flex:1},
    { field: "mt_name", headerName: "*자재명", editable: true,  checkboxSelection: true, flex:1},
    { field: "mt_code", headerName: "*자재코드", editable: true, flex:1},
    { field: "price", headerName: "입고단가(원)", editable: true, flex:1},
    { field: "order_qy", headerName: "*수량", editable: true, flex:1},
    { field: "unit", headerName: "*단위", editable: true, flex:1},
    { field: "order_date", headerName: "*발주일", valueFormatter: customDateToday, cellDataType: "date", flex:1},
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
        cellEditor: "agDateCellEditor", cellDataType: "date", editable: true, flex:1 }
];

//ag grid 요청테이블 옵션 설정
const reqGridOptions = {
      columnDefs: reqColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20],
      paginateChildRows: true
};

//자재 목록 테이블 옵션 설정
const mtListGridOptions = {
    columnDefs: mtListColDefs,
    animateRows: false,
    paginationPageSize: 10
};
//요청 리스트의 params.api를 담을 변수
const gridApi = ref(null);

//요청리스트 ag grid가 생성될때 발생한 ag grid의 api를 변수에 담음
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
const addRow = (info) => {
    //console.log(info);
    //만약 이미 발주 자재 리스트에 같은 자재가 있다면 행이 추가되지 않음.
    for(let i=0; i<orderRowData.value.length; i++) {
        if(info[0].mtril_code == orderRowData.value[i].mt_code) {
            toast.add({ severity: 'warn', summary: '자재 중복', detail: '이미 같은 자재가 리스트에 있습니다', life: 3000 });
            return;
        };
    };

    for(let i=0; i<info.length; i++) {
        //행추가할 객체 생성
        let obj = {order_no: 0, req_code: "", mt_name: info[i].mtril_name, mt_code: info[i].mtril_code, price: 0, order_qy: 0, 
        unit: info[i].unit, order_date: "", dedt: ""};
    
        //add:[]배열안에 객체 형태로 데이터를 넣으면 됨.
        mtListGridApi.value.applyTransaction({add: [obj]});
    };
};

//행 삭제
const removeRow = () => {
    /*
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
        //삭제버튼 비활성화
        delBtn.value = false;
    };
    */
   //선택된 행 노드 가져오기
    const delNodes = mtListGridApi.value.getSelectedNodes();

    if(delNodes <= 0) {
        toast.add({ severity: 'warn', summary: '행 삭제', detail: '삭제할 행을 선택해주세요', life: 3000 });
        return;
    };

    //선택된 행 삭제하기
    delNodes.map((node) => {
        mtListGridApi.value.applyTransaction({ remove: [node.data] });
    });

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
    //입력한 데이터 모두 화면에서 삭제
    removeAllInfo();
    router.go(0);
    //router.push({path : '/materials/mtOrder'})

};

//watch사용. 선택한 발주건 발주코드 값이 변할때마다 처리해야함.
watch(() => orderCode.value, async(newVal) => {
    
    let result = await axios.get(`${ajaxUrl}/mtril/mtListOnOrder/${orderCode.value}`)
                      .catch(err=>console.log(err));

    console.log(result);
    //거래처명, 주문명 인풋박스에 넣기
    companyName = result.data[0].company_name;
    orderName = result.data[0].req_name;
    companyCode = result.data[0].company_code;
    
    //화면에 보이는 행 데이터 넣기
    orderRowData.value = result.data;

    //수정을 위해서 db에서 가저온 데이터를 다른 변수에도 저장함.
    orderDataFromDb.value = result.data;

    //삭제버튼 활성화
    delBtn.value = true;
    sendCompanyInfo(result);
});



//요청 자재 리스트 가져오기
const mtReqList = async() => {
    let result = await axios.get(`${ajaxUrl}/mtril/reqOrderList`)
                            .catch(err => console.log(err));
    //요청 행에 데이터 넣기
    reqRowData.value = result.data;
    
};
//페이지 들어오면 바로 요청
mtReqList();

//자재 등록
const insertMtOrderList = async() => {
    let rowData = [];
    //각 행의 데이터를 가져와서 rowData배열에 푸쉬(객체의 배열 형식)
    mtListGridApi.value.forEachNode((node) => rowData.push(node.data));

    //행 데이터가 없을 경우 아무 작업 없이 종료.
    if(rowData.length <= 0) {
        return;
    };
    //유효성 검사
    for(let i=0; i<rowData.length; i++) {

        try{
            if(rowData[i].dedt.length>0);
        } catch {
            toast.add({ severity: 'warn', summary: '입력 오류', detail: '납기일을 확인해주세요.', life: 3000 });
            return;
        }
        //주문날짜 오늘날짜로 설정
        rowData[i].order_date = customDateToday();

        //dedt db에 넣을수 있는 포멧으로 바꾸기
        rowData[i].dedt = new Date(rowData[i].dedt);
        let month = rowData[i].dedt.getMonth() + 1;
        let day = rowData[i].dedt.getDate();
        rowData[i].dedt = `${rowData[i].dedt.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

        //숫자로 입력했지만 string타입이라 숫자로 변환.
        rowData[i].order_qy = parseInt(rowData[i].order_qy);

        if(orderName == "" || companyName == "") {
            //발주명, 거래처명 이 비어있으면 오류
            toast.add({ severity: 'warn', summary: '입력 오류', detail: '발주명, 거래처 명을 확인해주세요.', life: 3000 });
            return;
        } else if (rowData[i].dedt.length == 0 || rowData[i].dedt == undefined) {
            //납기일이 비어 있으면 오류 메세지 출력
            toast.add({ severity: 'warn', summary: '입력 오류', detail: '납기일을 확인해주세요.', life: 3000 });
            return;
        } else if (orderName.length > 20) {
            //발주명이 20자 이상이면 오류
            toast.add({ severity: 'warn', summary: '입력 오류', detail: '발주명은 20자 이하로 작성해주세요.', life: 3000 });
            return;
        };
            //수량 입력이 잘못됐을 경우 오류 출력
        if((parseInt(rowData[i].order_qy) <= 0)) {
            toast.add({ severity: 'warn', summary: '입력 오류', detail: '주문수량을 확인해주세요.', life: 3000 });
            return;
        };
        //납기일 날짜가 발주일보다 빠른 경우 오류 출력 밀리세컨 단위로 계산.
        if((new Date(rowData[i].order_date) - new Date(rowData[i].dedt)) > 0) {
            toast.add({ severity: 'warn', summary: '입력 오류', detail: '날짜 입력이 잘못되었습니다.', life: 3000 });
            return;
        };

        //기타 내용들 배열에 추가(거래처명, 거래처코드, 사원번호, 발주명)
        rowData[i] = ({...rowData[i], company_name: companyName, company_code: companyCode, emp_id: empId, order_name: orderName});
    };
    

    if(orderCode.value != "") {
        //모달에서 수정할 데이터를 선택하면 orderCode.value에 값이 담기게 됨. 수정일때 공백이 아니면 조건에 해당.

        //수정 데이터 보내기
        modifyOrder(rowData);

    } else {
        //입력 데이터 보내기
        let result = await axios.post(`${ajaxUrl}/mtril/insertMtOrderList`, rowData)
                                 .catch(err=>console.log(err));
                                
        console.log('등록 작동');
        console.log('결과 ', result);
        if(result.data == 'success') {
            toast.add({ severity: 'success', summary: '발주 등록 완료', detail: '처리가 완료되었습니다.', life: 3000 });
            removeReq(rowData);
        } else {
            toast.add({ severity: 'warn', summary: '발주 등록 실패', detail: '문제가 생겼습니다.', life: 3000 });
        };
    };
    

    
};

//발주 등록 성공 후 요청 리스트에서 삭제하기
const removeReq = (rowData) => {

    //입력한 데이터 모두 화면에서 삭제
    removeAllInfo();

    for(let i=0; i<reqRowData.value.length; i++) {
        //요청 코드가 없다면 함수종료
        if(rowData[i].req_code == "") {
            return;
        };
        //요청코드가 있다면 해당 행 삭제, 행추가는 아래서부터 되기때문에 rowData배열의 길이가 더 길어도 상관없음
        if(reqRowData.value[i].req_code == rowData[i].req_code) {
            //행 데이터 화면에서 삭제
            reqRowData.value.splice(i, 1);
        };
    };
};

//발주건 수정하기
const modifyOrder = async(rowData) => {

    /*
    기존 데이터를 모두 삭제할 경우의 예외처리는 아래
    현재는 행을 삭제하면 아래서부터 순차적으로 삭제되기 때문에 기존데이터가 모두 삭제될 경우 수정버튼이 발주버튼으로 바뀌게 됨.
    만약 선택 삭제 기능이 들어온다면 사용할수 있도록 주석처리. 서버는 해당 예외처리가 돼 있음. 수정없어도 됨.

    let isReqCode = true;
    for(let i=0; i<rowData.length; i++) {
        if(rowData[i].reqCode != "") {
            isReqCode = false;    
        };
    };
    if(isReqCode) {
        toast.add({ severity: 'warn', summary: '발주 수정 실패', detail: '기존 데이터를 모두 삭제할 수 없습니다.', life: 3000 });
        return;
    }
    */

    //사용자가 수정한 데이터 orderRowData.value
    //db에서 처음 가져온 자재 리스트 데이터 orderDataFromDb.value

    //console.log(rowData);
    //console.log(orderDataFromDb.value);


    //행이 아무것도 없으면 에러 메시지 출력
    if(rowData.length == 0) {
        toast.add({ severity: 'warn', summary: '발주 수정 실패', detail: '수정할 행이 없습니다.\n데이터를 입력해주세요.', life: 3000 });
        return;
    };

    //db로 보낼 수정할 데이터
    let sendData = [];
    
    //입력된 행 데이터 배열의 길이만큼 반복
    for(let i=0; i<rowData.length; i++) {

        if(rowData[i].order_no == 0) {
            //입력된 데이터의 order_no가 0일 경우 '행추가'를 하여 새롭게 등록하는 데이터. ==> 입력
            sendData.push({...rowData[i], state: 'insert', order_code: orderCode.value});
        };

        //처음 db에서 가져온 데이터 배열의 길이만큼 반복
        for(let j=0; j<orderDataFromDb.value.length; j++) {
            if(rowData[i].order_no == orderDataFromDb.value[j].order_no) {
                //입력된 정보와 원데이터의 order_no가 같은 경우 ==> 업데이트
                sendData.push({...rowData[i], state: 'update', order_code: orderCode.value});
            };
        };
    };

    //원데이터의 길이만큼 반복
    for(let i=0; i<orderDataFromDb.value.length; i++) {
        //해당 주문번호를 삭제 해야되면 false로 값이 할당됨.
        let delCnt = true;

        //보낼 데이터의 길이만큼 반복
        for(let j=0; j<sendData.length; j++) {
            if(orderDataFromDb.value[i].order_no == sendData[j].order_no) {
                //원데이터의 order_no가 sendData에 같은게 있으면 삭제하면 안됨. 없는 경우 ==> 삭제
                delCnt = false;
            }; 
        };
        if(delCnt) {
            //삭제할 주문번호와 상태를 배열에 푸쉬
            sendData.push({order_no: orderDataFromDb.value[i].order_no, state: 'delete', order_code: orderCode.value});
        };
    };


    //보낼 데이터 확인
    console.log('보낼 데이터: ', sendData);

    //수정데이터 보내기, 등록, 삭제 한번에 처리함.
    let result = await axios.post(`${ajaxUrl}/mtril/modifyOrderList`, sendData)
                            .catch(err=>console.log(err));

    if(result.data == 'success') {
        toast.add({ severity: 'success', summary: '수정 완료', detail: '처리가 완료되었습니다.', life: 3000 });
        //입력한 데이터 모두 화면에서 삭제
        removeAllInfo();
    } else {
        toast.add({ severity: 'error', summary: '수정 실패', detail: '처리를 실패했습니다.', life: 3000 });
    }
};

//발주건 삭제하기
const delOrder = async() => {
    let result = await axios.delete(`${ajaxUrl}/mtril/deleteOrder/${orderCode.value}`)
                            .catch(err=>console.log(err));

    //행 개수와 삭제된 행 개수가 같으면 성공
    if(result.data.affectedRows == orderRowData.value.length) {
        //처리완료 메세지
        toast.add({ severity: 'success', summary: '발주 삭제 완료', detail: '처리가 완료되었습니다.', life: 3000 });
        removeAllInfo();
    } else {
        //처리 실패 메세지
        toast.add({ severity: 'error', summary: '발주 삭제 실패', detail: '문제가 생겼습니다.', life: 3000 });
    };

};

//내용 삭제 함수
const removeAllInfo = () => {
    //보이는 내용 삭제
    orderRowData.value = [];

    //발주명, 거래처명, 거래처코드 초기화
    //orderName = "";
    //companyName = "";
    //companyCode = "";

    //삭제버튼 비활성화
    delBtn.value = false;

    //수정버튼 비활성화
    orderCode.value = false;


};

</script>

<style scoped>
.emp_info {
  width: 100px;
  margin-right: 20px;
}

.btn {
    margin-left: 10px;
    --bs-btn-line-height: 1.5px;
}
.btnGroup{
    margin: 10px;
}
.btnGroup{
    line-height: 1px; 
    color: #fff;
}
.select-req-mt {
    margin-bottom: 10px; 
    margin-left: 87%;
}
.p-inputtext {
    width: 310px;
    height: 37px;
    padding: 0!important;
}

.search-order-modal-Btn {
    margin-bottom: 10px;
}
.top-btn {
    margin-top: 10px;
    right: -70%;
    display: flex;
    justify-content: right;
}

</style>