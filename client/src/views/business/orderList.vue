<template>
    <div class="businessOrderListTitle">
        주문 조회
    </div>
    <div class="container">
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">업체명</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="filter_mtlty_name">
            </div>
            <div class="col-auto">
                <span class="form-text">
                ex 예담
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">주문일자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="filter_order_date">
            </div>
            <div class="col-auto">
                <span class="form-text">
                ex 2024-12-15
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">납품일자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="filter_dete">
            </div>
            <div class="col-auto">
                <span class="form-text">
                ex 2025-08-23
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">주문번호</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="filter_order_no">
            </div>
            <div class="col-auto">
                <span class="form-text">
                ex ORDER-01
                </span>
            </div>
        </div>
        <div>
            <button type="button" class="btn btn-secondary" @click="filteredResult()">조회</button>
            <button type="button" class="btn btn-secondary" @click="resetFilter()">초기화</button>
        </div>
    </div>
    <div>
        <ag-grid-vue :rowData="filteredRowData" :columnDefs="colDefs" style="height: 500px" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
        @grid-ready="onGridReady" rowSelection="multiple">
        </ag-grid-vue>
    </div>
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
            filteredRowData:'', 
            colDefs: '', 

            filter_order_no: '', 
            filter_mtlty_name: '', 
            filter_order_date: '', 
            filter_dete: '', 
        }; 
    }, 
    created() { 
        this.getorderList(); 
        this.colDefs = ref([ 
            { field: "order_no", headerName:"주문번호" }, 
            { field: "mtlty_name", headerName:"거래처"}, 
            { field: "order_date", headerName:"주문일자", 
                valueFormatter:this.customDateFormat1
             }, 
            { field: "dete", headerName:"납품일자", 
                valueFormatter:this.customDateFormat2 }, 
            { field: "prd_code", headerName:"품목코드" }, 
            { field: "prd_name", headerName:"품목명" }, 
            { field: "order_qy", headerName:"수량" }, 
            { field: "wrter", headerName:"작성자" }, 
            { field: "process_status", headerName:"처리상태" }, 
            { field: "prdctn_at", headerName:"생산여부" } 
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
                onCellClicked:params => {
                    this.goToDetail(params.node.data.order_no);
                    console.log('cell was clicked', params.node.data.order_no);
                }
        }; 

    }, 
    name: "App", 
    components: { 
        AgGridVue, // Add Vue Data Grid component
    }, 
    methods: { 
        onGridReady(params){ 
            this.gridApi = params.api; 
            this.columnApi = params.columnApi; 
        }, 
        async getorderList() { 
            let result = await axios.get(`${ajaxUrl}/business/orderList`) 
                .catch(err => console.log(err)); 
            this.orderList = result.data; 
            console.log(result, result.data); 
            this.rowData = ref(this.orderList); 
            this.filteredRowData= this.rowData; 
            // console.log(this.rowData);
            // console.log(...this.rowData);
        }, 
        customDateFormat1(params){ 
            return userDateUtils.dateFormat(params.data.order_date,'yyyy-MM-dd'); 
        }, 
        customDateFormat2(params){ 
            return userDateUtils.dateFormat(params.data.dete,'yyyy-MM-dd'); 
        }, 
        goToDetail(order_no){ 
            this.$router.push({name:'orderInfo', params : {order_no:order_no}}); 
        }, 
        filteredResult(){ 
            //console.log(this.gridApi, this.colDefs, this.rowData.filter()); 
            this.filteredRowData = this.rowData.filter((row)=>{ 
                let orderDate = row.order_date; 
                let newDete = row.dete; 
                let filter_order_date = !this.filter_order_date || orderDate >= this.filter_order_date;
                let filter_dete = !this.filter_dete || newDete >= this.filter_dete;
                return( 
                    (!this.filter_order_no || row.order_no.includes(this.filter_order_no)) && 
                    (!this.filter_mtlty_name || row.mtlty_name.includes(this.filter_mtlty_name)) && 
                    filter_order_date && filter_dete
                ) ;
            }) 
        }, 
        resetFilter(){
            this.filter_order_no = ''; 
            this.filter_mtlty_name = ''; 
            this.filter_order_date = ''; 
            this.filter_dete = ''; 
            this.filteredRowData = this.rowData; 
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
        height : 60px;
        line-height:60px;
        margin:5px;
    }

</style>