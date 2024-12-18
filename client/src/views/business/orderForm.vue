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
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.p_code" placeholder="BCNC-01">
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
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.order_date" placeholder="2024-12-28">
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
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.dete" placeholder="2025-08-17">
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
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.order_no" placeholder="ORDER-01">
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
            rowData: ref([]), 
            colDefs: '', 
            requst:{}, 
            orderRegister: {}
        };
    },
    created() {
        this.onAddRow();
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
            for(let i=0; i < this.gridApi.getRenderedNodes().length; i++){
                this.orderRegister = {...this.gridApi.getRenderedNodes()[i].data, ...this.requst}
                console.log("합친결과는");
                console.log(this.orderRegister);
                let result = await axios.post(`${ajaxUrl}/business/orderForm`,this.orderRegister)
                                             .catch(err=>console.log(err));
                console.log("결과는");
                console.log(result);
                let addRes = result;
                if(addRes.order_no != null){
                    alert(`등록되었습니다.`);
                    this.orderRegister.order_no = addRes.order_no;
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
            console.log("DOM 객체");
            console.log(this.gridApi.getRenderedNodes()); // 배열, [0].data.prd_code로 가져옴
            console.log("0번 데이터");
            console.log(this.gridApi.getRenderedNodes()[0].data);
            console.log("0번데이터 공급가액"+this.gridApi.getRenderedNodes()[0].data.splpc);
            console.log("DOM 객체 길이"+this.gridApi.getRenderedNodes().length);
            for ( let i = 0; i < this.gridApi.getRenderedNodes().length; i++){
                this.rowData[i] = this.gridApi.getRenderedNodes()[i].data;
                console.log(this.rowData[i]);
            }
        },
        onAddRow(){
            let newData = {
                prd_code:"PRD-01", 
                untpc: 300, 
                order_qy: 100, 
                splpc: 30000, 
                taxamt: 3000, 
                smprice: 33000
            };
            this.rowData = [...this.rowData, newData];
            // this.rowData.push(newData);
            console.log(this.rowData);
        },
        onRemoveSelected(){
            this.rowData.pop();
            this.rowData = [...this.rowData];
        },
        onInsertInit(){

            this.requst = {
                p_code : "BCNC-01", 
                order_date :"2024-12-28", 
                dete : "2025-08-17", 
                order_no : "ORDER-00"
            }
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