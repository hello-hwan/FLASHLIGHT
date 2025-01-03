<template>
    <v-card class="mx-auto card-custom-1" style="border-radius:13px;">
        <template v-slot:title>
            <span class="font-weight-black">
                주문 상세
            </span>
        </template>
    </v-card>

    <v-container fluid style="position:relative; z-index: 1;">
        <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12" >
          <v-card class="mx-auto" style="border-radius: 13px;">
            <v-card-text class="bg-surface-light pt-4">
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
                        <div class="col-auto">
                            <span class="form-text">
                            2024-00-00
                            </span>
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
                    <div style="margin-top:10px;" v-if="this.orderModifyCheck < 1">
                        <!-- <button type="button" class="btn btn-secondary" @click="getAllRows()">저장</button> -->
                        <button type="button" class="btn btn-success" @click="orderListReplace()" style="color:white;">주문수정</button>
                        <button type="button" class="btn btn-warning" @click="getorderInfoList()" >초기화</button>
                        <button type="button" class="btn btn-danger" @click="delOrderInfo()" style="color:white;">주문삭제</button>
                        <button type="button" class="btn btn-danger orderRowInsert" @click="deleteBtn()" style="color:white;">선택행삭제</button>
                        <button type="button" class="btn btn-success orderRowInsert" @click="modalOpen2()" style="color:white;">행추가</button>
                        <button type="button" class="btn btn-success" @click="onBtnExportDataAsCsvLotList()" style="color:white;">EXCEL 내보내기</button>
                    </div>
                    <div style="margin-top:10px;" v-else>
                        <button type="button" class="btn btn-success" @click="onBtnExportDataAsCsvLotList()" style="color:white;">EXCEL 내보내기</button>
                    </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>


    </v-container>
    <v-card-text class="bg-surface-light pt-4">
        <div>
            <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 519px; margin:0 auto" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
            @grid-ready="onGridReady" rowSelection="multiple">
            </ag-grid-vue>
        </div>
    </v-card-text>
    
    <span style="margin-left:20px; margin-bottom:0; margin-top:0;">
        <div class="modal-wrap" @click="modalOpen2" v-show="modalCheck2" >
            <div class="modal-container" @click.stop="">
                <div id="search-bar">
                    <div class="align-left"> 
                        <span>제품 코드</span>
                        <InputText type="text" v-model="this.searchProductCode" v-on:keyup.enter="searchProduct"> <p>{{ this.searchProductCode }}</p></InputText>
                        <span>제품 명</span>
                        <InputText type="text" v-model="this.searchProductName" v-on:keyup.enter="searchProduct"> <p>{{ this.searchProductName }}</p></InputText>
                    </div>
                    <button @click="searchProduct"class="btn btn-primary search-btn" >조회</button>
                </div>
    
                <AgGridVue 
                    :rowData="rowData2"
                    :gridOptions="GridOptions2"
                    class="ag-theme-alpine"
                    style="height: 500px"
                    @grid-ready="onGridReady2"
                    rowSelection="multiple"
                >
                </AgGridVue>
    
                <div class="modal-btn">
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
    //import userDateUtils from '@/utils/useDates.js';
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
                orderModifyCheck:1,
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
            this.getorderInfoList();
            this.getOrderModify();
            this.colDefs = ref([ 
            { field: "order_list_no", headerName:"주문목록번호", editable: true, hide: true }, 
            { field: "prd_code", headerName:"품목코드", editable: true, checkboxSelection: true }, 
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
            { field: "prdlst_code", headerName: "제품코드"},
            { field: "prdlst_name", headerName: " 제품이름"},
            { headerName : "선택",  checkboxSelection: true, flex:0.3}];
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
            onGridReady(params) { 
                this.gridApi = params.api; 
                this.columnApi = params.columnApi; 
            }, 
            onGridReady2(params){
                this.gridApi2=params.api;
                this.columnApi2=params.columnApi;
            },
            async getOrderModify(){
                console.log('주문 수정 여부 체크', this.selectNo);
                let result = await axios.get(`${ajaxUrl}/business/orderModify/${this.selectNo}`)
                                        .catch(err=> console.log(err));
                console.log('주문건 진행수량',result.data[0].count);
                if (result.data[0].count == 0){
                    this.orderModifyCheck = 0
                } ;

            },
            async getorderInfoList(){ 
                console.log(`상세조회 시작`,this.selectNo); 
                let result = await axios.get(`${ajaxUrl}/business/orderList/${this.selectNo}`) 
                                            .catch(err=>console.log(err)); 
                console.log(`받아온 값`, result); 
                console.log(`받아온 값의 데이터`, result.data); 
                console.log(`첫번째 데이터 값`, result.data[0]); 
                console.log(`첫번째 데이터 값 중 p 코드`, result.data[0].p_code); 
                this.orderInfoList = result.data; 
                console.log(this.orderInfoList); 
                this.requst.p_code = result.data[0].p_code; 
                this.requst.order_date = result.data[0].order_date; 
                this.requst.dete = result.data[0].dete; 
                this.requst.order_no = result.data[0].order_no; 
                console.log(this.requst); 
                this.rowData = ref(this.orderInfoList); 
            }, 
            selectOrder2 () {
            console.log('오더폼 데이터',this.gridApi.getSelectedNodes());
            this.modalOpen2();
            console.log('선택된 제품 값',this.gridApi2.getSelectedNodes());
            const selectedNodes = this.gridApi2.getSelectedNodes();
            const productSelectedData = selectedNodes.map((node) => node.data);
            if(productSelectedData[0] != null){
                console.log('모달에서 선택된 행 데이터:', productSelectedData[0].prdlst_code);
                let rowCount = this.rowData.find(data => data.prd_code == productSelectedData[0].prdlst_code);
                if(rowCount == null && productSelectedData[0].prdlst_code != null){
                    let newData = {
                        index: this.index,
                        prd_code:productSelectedData[0].prdlst_code, 
                        prd_name:productSelectedData[0].prdlst_name, 
                        untpc: 0, 
                        order_qy: 0,
                        wrter:"김기환"
                    };
                    this.index = this.index + 1;
                    console.log('뉴데이터값은',newData);
                    this.rowData = [...this.rowData, newData];
                    console.log(this.rowData);
                } else {
                    this.toast.add({ severity: 'warn', summary: '실패', detail: '제품코드가 중복입니다.', life: 3000 });
                }
            } else {
                this.toast.add({ severity: 'warn', summary: '실패', detail: '제품이 선택되지 않았습니다.', life: 3000 });
            }
        },
            async orderListReplace() { 
                this.delOrderInfo();
                for(let i=0; i < this.gridApi.getRenderedNodes().length; i++){ 
                    let orderRegister = { ...this.requst,...this.gridApi.getRenderedNodes()[i].data };
                    console.log("합친결과는"); 
                    console.log(orderRegister); 
                    let result = await axios.post(`${ajaxUrl}/business/orderForm`,orderRegister)
                                                 .catch(err=>console.log(err)); 
                    console.log("결과는", result); 
                    this.toast.add({ severity: 'success', summary: '수정', detail: '수정성공', life: 3000 });
                } 
            }, 
            async delOrderInfo(){
                let result = await axios.delete(`${ajaxUrl}/business/orderInfo/${this.selectNo}`)
                                               .catch(err=>console.log(err));
                    console.log(result);
            },
            onAddRow(){ 
                let newData = { 
                    order_list_no: "ORDER-00-0", 
                    prd_code:"PRD-01", 
                    untpc: 0, 
                    order_qy: 0, 
                    wrter:"김기환" 
                }; 
                this.rowData = [...this.rowData, newData]; 
                console.log(this.rowData); 
            }, 
            onRemoveSelected(){ 
                this.rowData.pop(); 
                this.rowData = [...this.rowData]; 
            }, 
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
                    this.toast.add({ severity: 'success', summary: '삭제', detail: '삭제성공', life: 3000 });
                } 
            }, 
            onBtnExportDataAsCsvLotList(){
                this.gridApi.exportDataAsCsv();
            },
            modalOpen2 () {
            this.modalCheck2 = !this.modalCheck2;
            console.log(this.modalCheck2);
                //행 데이터 초기화
                this.rowData2 = [];
    
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

</style>