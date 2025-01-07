<template>

    <!-- 주문 상세 페이지 -->
    <v-container fluid style="position:relative; z-index: 1;">
        <v-row>
            <v-col cols="12" >
                <v-card class="mx-auto" style="border-radius: 13px;">

                    <!-- 페이지 이름 -->
                    <template v-slot:title>
                        <span class="font-weight-black">
                            주문 상세
                        </span>
                    </template>

                    <!-- AG GRID 주문 상세 내용 -->
                    <v-card-text class="bg-surface-light pt-4">

                        <!-- 모달창으로 거래처 검색 -->
                        <div class="row g-3 align-items-center">
                            <bfSearchCompanyModal v-bind:info="this.orderInfomation" @companySelectedData="getBFCompanyInfo" style="margin:0px; padding: 0px;" />
                        </div>
                        <div class="row g-3 align-items-center">
                            <div class="col-2">
                                <label for="orderInfoOrderDate" class="col-form-label">주문일자</label>
                            </div>
                            <div class="col-auto">
                                <input type="date" id="orderInfoOrderDate" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.order_date" >
                            </div>
                        </div>
                        <div class="row g-3 align-items-center">
                            <div class="col-2">
                                <label for="orderInfoDete" class="col-form-label">납품일자</label>
                            </div>
                            <div class="col-auto">
                                <input type="date" id="orderInfoDete" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.dete" >
                            </div>
                        </div>
                        <div class="row g-3 align-items-center">
                            <div class="col-2">
                                <label for="orderInfoOrderNo" class="col-form-label">주문번호</label>
                            </div>
                            <div class="col-auto">
                                <input type="text" id="orderInfoOrderNo" class="form-control" aria-describedby="passwordHelpInline" v-model="this.selectNo" disabled>
                            </div>
                        </div>

                        <!-- 버튼 위치 -->
                        <div style="margin-top:10px; margin-bottom: 10px;" v-if="this.orderModifyCheck < 1 && this.delCheck < 1">
                            <!-- <button type="button" class="btn btn-secondary" @click="getAllRows()">저장</button> -->
                            <button type="button" class="btn btn-primary" @click="orderListReplace()" style="color:white;">주문수정</button>
                            <button type="button" class="btn btn-secondary" @click="getorderInfoList()" style="color:white;">초기화</button>
                            <button type="button" class="btn btn-danger" @click="delOrderInfo()" style="color:white;">주문삭제</button>
                            <button type="button" class="btn btn-danger orderRowInsert" @click="deleteBtn()" style="color:white;">선택행삭제</button>
                            <button type="button" class="btn btn-primary orderRowInsert" @click="modalOpen2()" style="color:white;">행추가</button>
                            
                        </div>
                        <div style="margin-top:10px;" v-else>
                            <button type="button" class="btn btn-primary" @click="onBtnExportDataAsCsvLotList()" style="color:white;">EXCEL 내보내기</button>
                        </div>

                        <!-- ag grid 내용 출력 -->
                        <div>
                            <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 519px; margin:0 auto" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
                            @grid-ready="onGridReady" rowSelection="multiple" overlayNoRowsTemplate="결과 없음">
                            </ag-grid-vue>
                        </div>

                        <!-- 엑셀로 내보내기 버튼 위치 -->
                        <button type="button" class="btn btn-primary" @click="onBtnExportDataAsCsvLotList()" style="margin-top: 10px; color:white;">EXCEL 내보내기</button>
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
                        <button @click="searchProduct"class="btn btn-primary search-btn" >조회</button>
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
                    overlayNoRowsTemplate="결과 없음"
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
    import bfSearchCompanyModal from '@/components/business/businessSearchCompanyModal.vue';
    ModuleRegistry.registerModules([AllCommunityModule]);
    
    import { useToast } from 'primevue/usetoast';

    import axios from 'axios';
    import { ajaxUrl } from '@/utils/commons.js';
    
    export default { 
        data() { 
            return { 
                selectNo:'',
                mtlty_name:'',
                p_code:'',
                orderInfoList:[], 
                rowData: ref([]),  
                rowData2:ref([]),
                colDefs:'',
                colDefs2:'',
                requst:{
                    p_code:'',
                    order_date:'',
                    dete:'',
                    order_no:''
                },
                orderModifyCheck : 1,
                delCheck : 1,
                orderInfomation: {mtltyName: '', pCode: ''},
                searchProductCode:'',
                searchProductName:'',
                modalCheck2:false,
                index:0,
                toast : useToast()
            }; 
        }, 
        created() { 
            console.log('--------------값을 받아오는 중입니까----------',this.$route.params);
            this.selectNo = this.$route.params.order_no;
            console.log(this.selectNo);
            this.mtlty_name = this.$route.params.mtlty_name;
            this.pCode = this.$route.params.p_code;
            this.orderInfomation.mtltyName = this.mtlty_name;
            this.orderInfomation.pCode = this.pCode;
            console.log('작동');
            console.log('------------------------자식으로 보내기 전 확인----------', this.orderInfomation);
            this.getOrderModify();
            this.getorderInfoList();
            this.colDefs = ref([ 
            { field: "order_list_no", headerName:"주문목록번호", editable: true, hide: true }, 
            { field: "prd_code", headerName:"품목코드", checkboxSelection: true }, 
            { field: "prd_name", headerName:"품목이름" }, 
            { field: "untpc", headerName:"주문단가", editable: true }, 
            { field: "order_qy", headerName:"주문수량", editable: true }, 
            { field: "wrter", headerName:"작성자", editable: true } 
            ]);
            this.gridOptionsOrder = { 
                columnDefs: this.returnColDefs, 
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
                }, 
                suppressFieldDotNotation : true 
            }; 
            this.colDefs2 = [
                { field: "prdlst_code", headerName: "제품코드", flex:1},
                { field: "prdlst_name", headerName: " 제품이름",flex:2},
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
            // 주문 상세 ag grid 객체
            onGridReady(params) { 
                this.gridApi = params.api; 
                this.columnApi = params.columnApi; 
            }, 
            // 품목 조회 ag grid 객체
            onGridReady2(params){
                this.gridApi2=params.api;
                this.columnApi2=params.columnApi;
            },
            // 상세조회 창 오픈
            async getorderInfoList(){ 
                console.log(`상세조회 시작`,this.selectNo); 
                // 주문 조회에서 받아온 주문 번호로 상세 조회후 값을 변수에 담아줌
                let result = await axios.get(`${ajaxUrl}/business/orderList/${this.selectNo}`) 
                                            .catch(err=>console.log(err)); 
                console.log(`결과의 데이터 값 중 첫번째 p 코드`, result.data[0].p_code); 
                // 가져온 값들로 상세조회 페이지 출력
                this.orderInfoList = result.data; 
                console.log(this.orderInfoList); 
                this.requst.p_code = result.data[0].p_code; 
                this.requst.order_date = result.data[0].order_date; 
                this.requst.dete = result.data[0].dete; 
                this.requst.order_no = result.data[0].order_no; 
                this.rowData = ref(this.orderInfoList); 
                // 출고 테이블에서 사용중인지 여부
                console.log(result.data.length);
                for (let i = 0; i <  result.data.length;i++){
                    // 주문목록번호는 배열은 0번, 주문번호는 1번으로 시작해서 1을 더하여 변수에 담음
                    let listNo = result.data[0].order_no + '-' + (i+1);
                    console.log('주문 목록 번호 조회 결과',listNo);
                    // 변수에 담은 주문목록번호가 출고 테이블에서 사용중인지 여부 조회
                    let listCheckResult = await axios.get(`${ajaxUrl}/business/orderModify2/${listNo}`)
                                            .catch(err=> console.log(err));
                    console.log(listCheckResult);
                    // 출고테이블에서 사용중이 아니면 체크변수를 0으로 변경
                    if(listCheckResult.data[0].count == 0){
                        this.delCheck = 0;
                    }
                }
            }, 
            // 수정가능 여부 체크 함수 -생산 계획에서 사용중인지 여부
            async getOrderModify(){
                console.log('주문 수정 여부 체크', this.selectNo);
                // 생산 계획에서 주문번호를 사용중인지 체크
                let result = await axios.get(`${ajaxUrl}/business/orderModify/${this.selectNo}`)
                                        .catch(err=> console.log(err));
                console.log('주문건 진행수량',result.data[0].count);
                // 생산계획에서 주문번호를 조회한 결과가 없으면 체크변수를 0으로 변경
                if (result.data[0].count == 0){
                    this.orderModifyCheck = 0
                } ;
            },
            // 제품 모달창 - 제품 코드 중복, 제품 미선택시 팝업 띄워줌 
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
            // 주문 수정 기능 - 주문 통째로 delete 이후 재 등록 
            async orderListReplace() { 
                // 주문목록에 내용이 있으면 수정
                if(this.gridApi.getRenderedNodes().length > 0){
                    // 주문 삭제
                    let result = await axios.delete(`${ajaxUrl}/business/orderInfo/${this.selectNo}`)
                                                   .catch(err=>console.log(err));
                    console.log(result);
                    // 주문 등록
                    for(let i=0; i < this.gridApi.getRenderedNodes().length; i++){ 
                        let orderRegister = { ...this.requst,...this.gridApi.getRenderedNodes()[i].data };
                        console.log("합친결과는"); 
                        console.log(orderRegister); 
                        let result = await axios.post(`${ajaxUrl}/business/orderForm`,orderRegister)
                                                     .catch(err=>console.log(err)); 
                        console.log("결과는", result); 
                    } 
                    // 리스트로 이동
                    this.$router.push({name:'orderList'});
                    this.toast.add({ severity: 'success', summary: '수정', detail: '수정성공', life: 3000 });

                } else {
                    // 주문목록에 내용이 없으면 표시할 팝업창
                    this.toast.add({ severity: 'warn', summary: '수정실패', detail: '수정할 내역을 입력하세요.', life: 3000 });
                }
                
            }, 
            // 주문 삭제 기능 - order_no 로 주문 요청, 주문리스트 동시에 삭제되는 프로시저
            async delOrderInfo(){
                console.log(this.selectNo);
                let result = await axios.delete(`${ajaxUrl}/business/orderInfo/${this.selectNo}`)
                                               .catch(err=>console.log(err));
                console.log(result);
                //리스트로 이동
                this.$router.push({name:'orderList'});
            },
            onRemoveSelected(){ 
                this.rowData.pop(); 
                this.rowData = [...this.rowData]; 
            }, 
            // 신규 행삭제
            deleteBtn(){ 
                const selectedNodes = this.gridApi.getSelectedNodes(); 
                console.log(selectedNodes); 
                for (let i = 0 ; i < selectedNodes.length ; i ++){ 
                    let result_arr = []; 
                    console.log(selectedNodes[i].data.order_list_no); 
                    for(let j = 0 ; j < this.rowData.length; j++){ 
                        if(this.rowData[j].order_list_no == selectedNodes[i].data.order_list_no){ 
                            continue; 
                        } 
                        result_arr = [...result_arr,this.rowData[j]]; 
                    } 
                    this.rowData=result_arr; 
                } 
            }, 
            // 엑셀 내보내기 기능
            onBtnExportDataAsCsvLotList(){
                this.gridApi.exportDataAsCsv();
            },
            // 제품 모달창 온 오프 기능 + 검색조건 초기화
            async modalOpen2 () {
                //모달창 온오프
                this.modalCheck2 = !this.modalCheck2;
                console.log(this.modalCheck2);

                //행 데이터 초기화
                this.rowData2 = [];

                // 조건 없이 초기 검색
                this.searchProduct();
    
                //검색조건 초기화
                this.searchProductCode = null;
                this.searchProductName = null;
            },
            //모달 발주건을 선택하고 확인버튼 클릭
            async searchProduct ()  {
                //서버로 보낼 검색 데이터
                let obj = {product_code: this.searchProductCode,
                        product_name: this.searchProductName
                };
                //console.log("새로만든 객체: ",obj);
                let result = await axios.post(`${ajaxUrl}/business/searchProduct`, obj)
                                        .catch(err=>console.log(err));

                console.log("통신결과: ",result);
                //행 데이터 담기
                this.rowData2 = result.data;   
            }
        } 
    } 
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
input/*[type="date"]*/ {
    width: 220px;
}

button{
    margin-left : 5px;
    margin-right: 5px;
    line-height: 15px;
}
</style>