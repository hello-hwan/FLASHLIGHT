<template>

    <!-- 주문 요청 페이지 -->
    <v-container fluid style="position:relative; z-index: 1;">
        <v-row>
            <v-col cols="12">
                <v-card class="mx-auto" style="border-radius: 13px;">

                    <!-- 페이지 이름 -->
                    <template v-slot:title>
                        <span class="font-weight-black">
                            주문 요청
                        </span>
                    </template>

                    <!-- AG GRID 주문 등록 내용 -->
                    <v-card-text class="bg-surface-light pt-4">

                        <!-- 모달창으로 거래처 검색 -->
                        <div class="row g-3 align-items-center">
                            <bfSearchCompanyModal @companySelectedData="getBFCompanyInfo" style="margin:0px; padding: 0px;" />
                        </div>
                        <div class="row g-3 align-items-center">
                            <div class="col-2">
                                <label for="orderFormOrderDate" class="col-form-label">주문일자</label>
                            </div>
                            <div class="col-auto">
                                <input type="date" id="orderFormOrderDate" class="form-control" v-model="this.requst.order_date">
                            </div>
                        </div>
                        <div class="row g-3 align-items-center">
                            <div class="col-2">
                                <label for="orderFormDete" class="col-form-label">납품일자</label>
                            </div>
                            <div class="col-auto">
                                <input type="date" id="orderFormDete" class="form-control" v-model="this.requst.dete">
                            </div>
                        </div>
                        <div class="row g-3 align-items-center">
                            <div class="col-2">
                                <label for="orderFormOrderNo" class="col-form-label">주문번호</label>
                            </div>
                            <div class="col-auto">
                                <input type="text" id="orderFormOrderNo" class="form-control" v-model="this.requst.order_no" disabled>
                            </div>
                        </div>

                        <!-- 버튼 위치 -->
                        <div style="margin-top:10px; margin-bottom:10px;">
                            <button type="button" class="btn btn-primary" @click="orderInsert()" style="color:white;">주문등록</button>
                            <button type="button" class="btn btn-secondary" @click="onInsertInit()" style="color:white;">초기화</button>
                            <button type="button" class="btn btn-danger orderRowInsert" @click="deleteBtn()" style="color:white;">선택행삭제</button>
                            <button type="button" class="btn btn-primary orderRowInsert" @click="modalOpen2()" style="color:white;">행추가</button>
                        </div>

                        <!-- ag grid 내용 출력 -->
                        <div>
                            <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 519px; position:relative; z-index:0;" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
                            @grid-ready="onGridReady" rowSelection="multiple" >
                            </ag-grid-vue>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <!-- 제품 검색 모달창 -->
    <span style="margin-left:20px; margin-bottom:0; margin-top:0;">
        <div class="modal-wrap" @click="modalOpen2" v-show="modalCheck2" >
            <div class="modal-container" @click.stop="">
                <div id="search-bar">

                    <!-- 검색창 -->
                    <div class="align-left"> 
                        <span>제품 코드</span>
                        <InputText type="text" v-model="this.searchProductCode" v-on:keyup.enter="searchProduct"> <p>{{ this.searchProductCode }}</p></InputText>
                        <span>제품 명</span>
                        <InputText type="text" v-model="this.searchProductName" v-on:keyup.enter="searchProduct"> <p>{{ this.searchProductName }}</p></InputText>
                    </div>

                    <!-- 조회 버튼 -->
                    <div style="display:flex; justify-content: center;">
                        <button @click="searchProduct"class="btn btn-primary search-btn">조회</button>
                    </div>
                </div>
                
                <!-- 제품 검색 내용 표시할 ag grid -->
                <AgGridVue 
                    :rowData="rowData2"
                    :gridOptions="GridOptions2"
                    class="ag-theme-alpine"
                    style="height: 500px"
                    @grid-ready="onGridReady2"
                    rowSelection="single"
                >
                </AgGridVue>

                <!-- 검색된 데이터를 입력하거나 취소하는 버튼 -->
                <div class="modal-btn" style="display:flex; justify-content: center;">
                    <button @click="modalOpen2"class="btn btn-secondary">닫기</button>
                    <button @click="selectOrder2" class="btn btn-primary">확인</button>
                </div>
            </div>
        </div>
    </span>
</template>

<script>
import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import userDateUtils from '@/utils/useDates.js'; 
ModuleRegistry.registerModules([AllCommunityModule]); 

import axios from 'axios'; 
import { ajaxUrl } from '@/utils/commons.js'; 

import bfSearchCompanyModal from '@/components/business/businessSearchCompanyModal.vue'; 

import store from '@/store'

import { useToast } from 'primevue/usetoast';

export default { 
    data() { 
        return { 
            orderList: [], 
            rowData: ref([]), 
            rowData2 : ref([]),
            colDefs: '',
            colDefs2:'', 
            requst:{}, 
            companyCode: '', 
            searchProductCode:'', 
            searchProductName:'', 
            modalCheck2 : false, 
            index : 0,
            empName : store.state.empInfo[store.state.empInfo.length - 1].name,
            toast : useToast(),
            dt :'',
            nextDt:''
        }; 
    }, 
    created() { 
        this.today();
        this.getOrderListNo();
        // this.onAddRow(); 
        this.colDefs = ref([ 
            { field: "index", hide: true, suppressToolPanel: true},
            { field: "prd_code", headerName:"품목코드", checkboxSelection: true }, 
            { field: "prd_name", headerName:"품목이름" }, 
            { field: "untpc", headerName:"주문단가", editable: true }, 
            { field: "order_qy", headerName:"주문수량", editable: true }, 
            { field: "wrter", headerName:"작성자", editable: true } 
        ]); 
        this.gridOptionsOrder = { 
                columnDefs: this.colDefs, 
                pagination: true, 
                paginationPageSize: 10, 
                paginationPageSizeSelector: [10, 20, 50, 100], 
                paginateChildRows: true, 
                animateRows: false, 
                filter: 'agTextColumnFilter', 
                defaultColDef: { 
                    filter: true, 
                    flex: 1, 
                    minWidth: 10 
                } 
        }; 
        this.colDefs2 = [
            { field: "prdlst_code", headerName: "제품코드", flex:1},
            { field: "prdlst_name", headerName: " 제품이름", flex:2},
            { headerName : "선택",  checkboxSelection: true, flex:0.3}
        ];
        this.GridOptions2 = {
            columnDefs: this.colDefs2,
            animateRows: false,
            pagination: true,
            paginationPageSize: 10,
            paginationPageSizeSelector: [10, 20, 50, 100],
        };
    }, 
    name: "App", 
    components: { 
        AgGridVue, // Add Vue Data Grid component
        bfSearchCompanyModal
    }, 
    methods: { 
        // 오늘 날짜 가져오기
        today(){
            // 오늘날짜 가져오기
            this.dt = new Date();

            this.nextDt = this.dt;

            // 주문 일자 오늘 날짜로 자동 등록
            this.requst.order_date = userDateUtils.dateFormat(this.dt,'yyyy-MM-dd');
            
            // 월에 1을 더해줌
            this.nextDt.setMonth(this.nextDt.getMonth() + 1);
            this.dt = new Date();
            console.log(userDateUtils.dateFormat(this.dt,'yyyy-MM-dd'));
            console.log(userDateUtils.dateFormat(this.nextDt,'yyyy-MM-dd'));

            // ex 1월 31일을 월에 1더하면 2월 31일이라서 2월로 될때까지 일수를 하나씩 뺌
            while(this.nextDt.getMonth() - this.dt.getMonth() == 2){
                this.nextDt.setDate(this.nextDt.getDate() - 1);
                console.log('날짜는',this.nextDt.getDate());
            }

            // 납기 일자는 월에 1을 더해서 자동 등록
            this.requst.dete =userDateUtils.dateFormat(this.nextDt,'yyyy-MM-dd');
        },
        onGridReady(params) { 
            this.gridApi = params.api; 
            this.columnApi = params.columnApi; 
        }, 
        onGridReady2(params) { 
            this.gridApi2 = params.api; 
            this.columnApi2 = params.columnApi; 
        }, 

        // 주문 등록 후 새로운 주문 등록화면으로 이동 
        async orderInsert() { 

            // 거래처와 주문 목록에 내용이 있는지 체크
            console.log('그리드 api 행의 숫자는',this.gridApi.getRenderedNodes().length);
            if(this.gridApi.getRenderedNodes().length > 0 && this.requst.p_code != null){
                // 가격과 수량을 체크할 변수에 기본값 1을 담아줌
                let numCheck = 1; 

                // 가격/수량을 확인해서 조건이 만족하지 않으면 0으로 변수 값 수정
                for(let i = 0; i < this.gridApi.getRenderedNodes().length; i++){ 
                    if ( this.gridApi.getRenderedNodes()[i].data.order_qy <= 0 || this.gridApi.getRenderedNodes()[i].data.untpc <= 0){
                        numCheck = 0; 
                    } 
                } 
                console.log('수량 체크 숫자는',numCheck);
                if(numCheck == 0){
                    this.toast.add({ severity: 'warn', summary: '실패', detail: '주문수량과 주문가격은 양수로 입력하세요.', life: 3000 });
                } else if(numCheck == 1) {
                    // 가격과 수량이 양수라면 DB에 등록
                    for(let i=0; i < this.gridApi.getRenderedNodes().length; i++){ 
                        // input창에 입력된 내용과 ag grid에 입력된 내용을 배열에 담아서 개별로 처리
                        let orderRegister = { ...this.requst,...this.gridApi.getRenderedNodes()[i].data };
                        let result = await axios.post(`${ajaxUrl}/business/orderForm`,orderRegister)
                                                     .catch(err=>console.log(err)); 
                        console.log("주문등록결과는", result); 
                    } 
                    // 성공시 팝업창 표시
                    this.toast.add({ severity: 'success', summary: '등록', detail: '등록성공', life: 3000 });
                    // 페이지 새로고침
                    history.go(0);
                } 
            } else if(this.requst.p_code == null){
                // 만약 거래처에 아무것도 없으면 등록 안하고 경고팝업 표시
                this.toast.add({ severity: 'warn', summary: '등록실패', detail: '거래처를 입력하세요.', life: 3000 });
            }else {
                // 만약 주문 목록에 아무것도 없으면 등록 안하고 경고팝업 표시
                this.toast.add({ severity: 'warn', summary: '등록실패', detail: '등록할 내역을 입력하세요.', life: 3000 });
            }
        }, 
        // 날짜 형식 수정
        customDateFormat1(params){
            return userDateUtils.dateFormat(params.data.order_date,'yyyy-MM-dd');
        },
        // 날짜 형식 수정
        customDateFormat2(params){
            return userDateUtils.dateFormat(params.data.dete,'yyyy-MM-dd');
        },
        // 모달창에서 선택된 제품의 데이터를 담는 함수
        selectOrder2 () {
            console.log(this.$store.empInfo);
            
            // 모달창 닫기
            this.modalOpen2();

            // 선택된 행을 담을 변수
            const selectedNodes = this.gridApi2.getSelectedNodes(); 

            // 선택된 행에 담겨진 데이터를 map 함수로 배열로 수정
            const productSelectedData = selectedNodes.map((node) => node.data); 

            // 선택된 행이 있다면 실행
            if(productSelectedData[0] != null){ 
                console.log('모달에서 선택된 행 데이터:', productSelectedData[0].prdlst_code); 

                // 현재 등록된 주문 목록에 해당 제품이 포함되어 있는지 확인하기 위해 find 함수로 체크
                let rowCount = this.rowData.find(data => data.prd_code == productSelectedData[0].prdlst_code); 

                // 만약 주문목록에 선택한 제품이 없다면 주문 목록에 추가
                if(rowCount == null && productSelectedData[0].prdlst_code != null){ 

                    // ag grid에 추가할 데이터
                    let newData = { 
                        index: this.index,
                        prd_code:productSelectedData[0].prdlst_code, 
                        prd_name:productSelectedData[0].prdlst_name, 
                        untpc: 0, 
                        order_qy: 0, 
                        wrter: this.empName 
                    }; 

                    // 인덱스 값 1추가
                    this.index = this.index + 1;
                    console.log('뉴데이터값은',newData);

                    //ag grid의 data 배열에 신규 데이터 추가
                    this.rowData = [...this.rowData, newData];
                    console.log(this.rowData);
                } else {
                    // 목록에 제품이 있다면 출력할 팝업
                    this.toast.add({ severity: 'warn', summary: '실패', detail: '제품코드가 중복입니다.', life: 3000 });
                }
            } else {
                // 제품이 선택되지 않았을때 출력할 팝업
                this.toast.add({ severity: 'warn', summary: '실패', detail: '제품이 선택되지 않았습니다.', life: 3000 });
            } 
        }, 
        // ag grid에 선택된 행 삭제
        deleteBtn(){ 
            // 선택된 행을 담아줄 변수
            const selectedNodes = this.gridApi.getSelectedNodes(); 
            console.log(selectedNodes); 

            // 선택된 행의 갯수만큼 반복
            for (let i = 0 ; i < selectedNodes.length ; i ++){ 

                // 신규배열 생성
                let result_arr = []; 
                console.log(selectedNodes[i].data.index); 

                // ag grid의 모든 행의 갯수만큼 반복 
                for(let j = 0 ; j < this.rowData.length; j++){ 

                    // index를 비교하여 같으면 추가하지 않고 건너 뜀
                    if(this.rowData[j].index == selectedNodes[i].data.index){ 
                        continue; 
                    } 

                    // 신규배열에 인덱스가 같은 행을 빼고 등록
                    result_arr = [...result_arr,this.rowData[j]]; 
                } 
                // index가 같은 행을 빼고 만들어진 배열을 ag grid의 rowData에 등록
                this.rowData=result_arr; 
            } 
        }, 
        // 초기화 - 새로고침
        onInsertInit(){ 
            history.go(0);
        }, 
        // 모달에서 받아온 거래처 내용을 담아줄 변수
        getBFCompanyInfo(info){ 
            this.requst.p_code = info[0].bcnc_code; 
        }, 
        // 주문 요청시 주문번호를 등록된 번호중 가장 큰 번호에 1을 더하여 자동으로 등록
        async getOrderListNo(){ 
            // 주문번호들을 담아줄 변수
            let list = await axios.get(`${ajaxUrl}/business/orderArray`) 
                                      .catch(err=>console.log(err)); 
            console.log(list.data); 
            // 주문 번호중 숫자만 남겨서 배열로 수정
            let orderNoArray = list.data.map(x => x.order_no.substr(6)); 
            // 주문번호의 숫자를 내림차순으로 정렬
            orderNoArray.sort((a,b) => b-a); 
            // 주문번호중 가장 큰 0번째 번호에 1을 더해줌
            this.requst.order_no = 'ORDER-' + ( orderNoArray[0] - 1 + 2 ); 
            console.log(this.requst.order_no); 
        }, 
        // 제품 모달창 오픈 후 자동으로 기본값 조회
        async modalOpen2 () { 
            //모달창 상태 open으로 변경
            this.modalCheck2 = !this.modalCheck2; 
            console.log(this.modalCheck2); 
            //행 데이터 초기화
            this.rowData2 = []; 
            
            //검색조건 초기화
            this.searchProductCode = null; 
            this.searchProductName = null; 
            // 조건없이 제품 조회
            await this.searchProduct();
        },
        // 코드와 이름으로 제품 검색
        async searchProduct ()  { 
            //서버로 보낼 검색 데이터
            let obj = {product_code: this.searchProductCode, 
                    product_name: this.searchProductName 
            }; 
            //console.log("새로만든 객체: ",obj);
            let result = await axios.post(`${ajaxUrl}/business/searchProduct`, obj) 
                                    .catch(err=>console.log(err)); 
            
            //행 데이터 담기
            this.rowData2 = result.data; 
        } 
    } 
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
.orderRowInsert{
     float: right;
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