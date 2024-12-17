<template>
    <div class="businessOrderListTitle">
        주문 요청
    </div>
    <div class="container">
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label" >업체코드</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="rowData.p_code">
            </div>
            <div class="col-auto">
                <span class="form-text">
                Must be 8-20 characters long.
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">주문일자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="rowData.order_date">
            </div>
            <div class="col-auto">
                <span class="form-text">
                Must be 8-20 characters long.
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">납품일자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="rowData.dete">
            </div>
            <div class="col-auto">
                <span class="form-text">
                Must be 8-20 characters long.
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">주문번호</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="rowData.order_no">
            </div>
            <div class="col-auto">
                <span class="form-text">
                Must be 8-20 characters long.
                </span>
            </div>
        </div>
        <div>
            <button type="button" class="btn btn-secondary" @click="getAllRows()">저장</button>
            <button type="button" class="btn btn-secondary" @click="orderInsert()">등록</button>
            <button type="button" class="btn btn-secondary" @click="onInsertInit()">초기화</button>
        </div>
    </div>
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 500px" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
        @grid-ready="onGridReady">
        </ag-grid-vue>
    </div>
    <button type="button" class="btn btn-secondary" @click="onAddRow()">추가</button>
    <button type="button" class="btn btn-secondary" @click="onRemoveSelected()">삭제</button>
</template>

<script>
import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import userDateUtils from '@/utils/useDates.js';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

export default {
    data() {
        return {
            orderList: [],
            rowData: '',
            colDefs: '',
            sample:{}
        };
    },
    created() {
        this.orderInsert();
        this.onInsertInit();
        this.rowData = [
            this.prd_code = ""
        ]
        this.colDefs = ref([
            { field: "prd_code", headerName:"품목코드", editable: true },
            { field: "untpc", headerName:"단가", editable: true },
            { field: "order_qy", headerName:"주문수량", editable: true },
            { field: "splpc", headerName:"공급가액", editable: true },
            { field: "taxamt", headerName:"세액", editable: true },
            { field: "smprice", headerName:"총합계금액", editable: true }
        ]);
        this.gridOptionsOrder = {
                columnDefs: this.returnColDefs,
                pagination: true,
                paginationPageSize: 10,
                paginationPageSizeSelector: [10, 20, 50, 100],
                paginateChildRows: true,
                animateRows: false,
                defaultColDef: {
                    filter: true,
                    flex: 1,
                    minWidth: 10
                },
                //rowSelection:'multiple'
            };
    },
    name: "App",
    components: {
        AgGridVue // Add Vue Data Grid component
    },
    methods: {
        onGridReady(params) {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        },
        async orderInsert() {
            for(let i; 0 <= i < this.rowData.length; i++){
                let result = await axios.post(`${ajaxUrl}/business/orderForm`,this.rowData[i].data)
                                             .catch(err=>console.log(err));
                console.log(result);
                let addRes = result.data;
                if(addRes.order_no != null){
                    alert(`등록되었습니다.`);
                    this.rowData.order_no = addRes.order_no;
                }
            }
        },
        customDateFormat1(params){
            return userDateUtils.dateFormat(params.data.order_date,'yyyy-MM-dd');
        },
        customDateFormat2(params){
            return userDateUtils.dateFormat(params.data.dete,'yyyy-MM-dd');
        },
        getAllRows() {
            console.log(this.gridApi.getRenderedNodes()[0].data.splpc)
        },
        onAddRow(){
            let newData = {
                prd_code:"기타", 
                untpc: "", 
                order_qy: "", 
                splpc: "", 
                taxamt: "", 
                smprice: ""
            };
            this.rowData = [...this.rowData, newData]
            console.log(this.rowData);
        },
        onRemoveSelected(){
            let selectedData = gridOptionsOrder.api.getSelectedRows();
            let res = gridOptionsOrder.api.updateRowData({remove:selectedData});
            printResult(res);
        },
        onInsertInit(){
            this.rowData = [
            this.prd_code = ""
        ]
        }
    }
};
</script>

<style lang="scss">

    .businessOrderListTitle{
        background-color: darkgrey;
        font-size:20px;
        text-align : center;
        width : 20%;
        height : 100px;
        line-height:100px;
        margin:5px;
    }
</style>