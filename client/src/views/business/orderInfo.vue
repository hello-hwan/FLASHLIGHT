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
                            <input type="text" id="orderInfoOrderDate" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.order_date" >
                        </div>
                        <div class="col-auto">
                            <span class="form-text">
                            2024-00-00
                            </span>
                        </div>
                    </div>
                    <div class="row g-3 align-items-center">
                        <div class="col-2">
                            <label for="orderInfoDete" class="col-form-label">납품일자</label>
                        </div>
                        <div class="col-auto">
                            <input type="text" id="orderInfoDete" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.dete" >
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
                        <button type="button" class="btn btn-success orderRowInsert" @click="onAddRow()" style="color:white;">행추가</button>
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
</template>
    
<script>
    import { ref } from 'vue';
    import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
    import { AllCommunityModule, ModuleRegistry, ValueCacheModule } from 'ag-grid-community';
    //import userDateUtils from '@/utils/useDates.js';
    import bfSearchCompanyModal from '@/components/business/businessSearchCompanyModal.vue';
    ModuleRegistry.registerModules([AllCommunityModule]);
    


    import axios from 'axios';
    import { ajaxUrl } from '@/utils/commons.js';
    
    export default { 
        data() { 
            return { 
                selectNo:'',
                mtlty_name:'',
                p_code:'',
                orderInfoList:[], 
                rowData: '', 
                colDefs:'',
                requst:{
                    p_code:'',
                    order_date:'',
                    dete:'',
                    order_no:''
                },
                orderModifyCheck:1,
                orderInfomation: {mtltyName: '', pCode: ''}
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
            async orderListReplace() { 
                this.delOrderInfo();
                for(let i=0; i < this.gridApi.getRenderedNodes().length; i++){ 
                    let orderRegister = { ...this.requst,...this.gridApi.getRenderedNodes()[i].data };
                    console.log("합친결과는"); 
                    console.log(orderRegister); 
                    let result = await axios.post(`${ajaxUrl}/business/orderForm`,orderRegister)
                                                 .catch(err=>console.log(err)); 
                    console.log("결과는"); 
                    console.log(result); 
                    let addRes = result.data; 
                    if(addRes.result){ 
                        alert(`수정되었습니다.`); 
                    } 
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
                } 
            }, 
            onBtnExportDataAsCsvLotList(){
                this.gridApi.exportDataAsCsv();
            }
        } 
    } 
</script>
    
<style lang="scss" scoped>
.orderRowInsert{
     float: right;
}

</style>