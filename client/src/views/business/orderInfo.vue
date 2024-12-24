<template>
    <div class="businessOrderListTitle">
        주문 상세
    </div>
    <div class="container">
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label" >업체코드</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.p_code" diabled>
            </div>
            <div class="col-auto">
                <span class="form-text">
                PRD-00
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">주문일자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.order_date" placeholder="2024-12-28">
            </div>
            <div class="col-auto">
                <span class="form-text">
                2024-00-00
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">납품일자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.dete" placeholder="2025-08-17">
            </div>
            <div class="col-auto">
                <span class="form-text">
                2024-00-00
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">주문번호</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.selectNo" disabled>
            </div>
            <div class="col-auto">
                <span class="form-text">
                ORDER-00
                </span>
            </div>
        </div>
        <div>
            <!-- <button type="button" class="btn btn-secondary" @click="getAllRows()">저장</button> -->
            <button type="button" class="btn btn-secondary" @click="orderListReplace()">주문수정</button>
            <button type="button" class="btn btn-secondary" @click="getorderInfoList()">초기화</button>
            <button type="button" class="btn btn-secondary" @click="delOrderInfo()">주문삭제</button>
            <button type="button" class="btn btn-secondary orderRowInsert" @click="deleteBtn()">선택행삭제</button>
            <button type="button" class="btn btn-secondary orderRowInsert" @click="onAddRow()">행추가</button>
        </div>
    </div>
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 500px" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
        @grid-ready="onGridReady" rowSelection="multiple">
        </ag-grid-vue>
    </div>
</template>
    
<script>
    import { ref } from 'vue';
    import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
    import { AllCommunityModule, ModuleRegistry, ValueCacheModule } from 'ag-grid-community';
    import userDateUtils from '@/utils/useDates.js';
    ModuleRegistry.registerModules([AllCommunityModule]);
    
    import axios from 'axios';
    import { ajaxUrl } from '@/utils/commons.js';
    
    export default { 
        data() { 
            return { 
                selectNo:'',
                orderInfoList:[], 
                rowData: '', 
                colDefs:'',
                requst:{
                    p_code:'',
                    order_date:'',
                    dete:'',
                    order_no:''
                }
            }; 
        }, 
        created() { 
            this.selectNo = this.$route.params.order_no;
            this.getorderInfoList();
            this.colDefs = ref([ 
            { field: "order_list_no", headerName:"주문목록번호", checkboxSelection: true, editable: true }, 
            { field: "prd_code", headerName:"품목코드", editable: true }, 
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
        }, 
        methods: { 
            onGridReady(params) { 
                this.gridApi = params.api; 
                this.columnApi = params.columnApi; 
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
            } 
        } 
    } 
</script>
    
<style lang="scss">
    .businessOrderListTitle{
        background-color: darkgrey;
        font-size:20px;
        text-align : center;
        width : 20%;
        height : 60px;
        line-height:60px;
        margin:5px;
        }
</style>