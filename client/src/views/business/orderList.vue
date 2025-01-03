<template>
    <v-card class="mx-auto card-custom-1" style="border-radius:13px;">
        <template v-slot:title>
            <span class="font-weight-black">
                주문 조회
            </span>
        </template>
    </v-card>
    <v-container fluid>
        <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <v-card-text class="bg-surface-light pt-4">
                    <div class="row g-3 align-items-center">
                        <div class="col-2">
                            <label for="orderListMtltyName" class="col-form-label">업체명</label>
                        </div>
                        <div class="col-auto">
                            <input type="text" id="orderListMtltyName" class="form-control" aria-describedby="passwordHelpInline" v-model="filter_mtlty_name" @keydown="filteredResult()">
                        </div>
                        <div class="col-auto">
                            <span class="form-text">
                            ex 예담
                            </span>
                        </div>
                    </div>
                    <div class="row g-3 align-items-center">
                        <div class="col-2">
                            <label for="orderListOrderDate" class="col-form-label">주문일자</label>
                        </div>
                        <div class="col-auto">
                            <input type="date" id="orderListOrderDate" class="form-control" aria-describedby="passwordHelpInline" v-model="filter_order_date" >
                        </div>
                        <div class="col-auto">
                            <span class="form-text">
                            ex 2024-12-15
                            </span>
                        </div>
                    </div>
                    <div class="row g-3 align-items-center">
                        <div class="col-2">
                            <label for="orderListDete" class="col-form-label">납품일자</label>
                        </div>
                        <div class="col-auto">
                            <input type="date" id="orderListDete" class="form-control" aria-describedby="passwordHelpInline" v-model="filter_dete">
                        </div>
                        <div class="col-auto">
                            <span class="form-text">
                            ex 2025-08-23
                            </span>
                        </div>
                    </div>
                    <div class="row g-3 align-items-center">
                        <div class="col-2">
                            <label for="orderListOrderNo" class="col-form-label">주문번호</label>
                        </div>
                        <div class="col-auto">
                            <input type="text" id="orderListOrderNo" class="form-control" aria-describedby="passwordHelpInline" v-model="filter_order_no" @keydown="filteredResult()">
                        </div>
                        <div class="col-auto">
                            <span class="form-text">
                            ex ORDER-01
                            </span>
                        </div>
                    </div>
                    <div style="margin-top:10px;">
                        <button type="button" class="btn btn-success" @click="filteredResult()" style="color:white;">조회</button>
                        <button type="button" class="btn btn-warning" @click="resetFilter()" >초기화</button>
                        <button type="button" class="btn btn-warning" @click="onBtnExportDataAsCsvLotList()" >EXCEL 내보내기</button>
                    </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-card-text class="bg-surface-light pt-4">
        <div>
            <ag-grid-vue :rowData="filteredRowData" :columnDefs="colDefs" style="height: 519px" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
            @grid-ready="onGridReady" rowSelection="multiple">
            </ag-grid-vue>
        </div>
    </v-card-text>
</template>

<script>
import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import userDateUtils from '@/utils/useDates.js';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

import { useToast } from 'primevue/usetoast';

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
            toast : useToast()
        }; 
    }, 
    created() { 
        this.getorderList(); 
        this.colDefs = ref([ 
            { field: "order_no", headerName:"주문번호" }, 
            { field: "p_code", headerName:"거래처코드",hide:true}, 
            { field: "mtlty_name", headerName:"거래처"}, 
            { field: "order_date", headerName:"주문일자", 
                valueFormatter:this.customDateFormat1
             }, 
            { field: "dete", headerName:"납품일자", 
                valueFormatter:this.customDateFormat2 }, 
            { field: "prd_code", headerName:"품목코드", hide:true }, 
            { field: "prd_name", headerName:"품목명" }, 
            { field: "order_qy", headerName:"수량" }, 
            { field: "wrter", headerName:"작성자", hide : true }, 
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
                    console.log('-------------------값 확인 보내기 전-----------', params.node.data.order_no, 
                                    params.node.data.mtlty_name,
                                    params.node.data.p_code);


                    this.goToDetail(params.node.data.order_no, 
                                    params.node.data.mtlty_name,
                                    params.node.data.p_code );
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
        goToDetail(order_no, mtlty_name, p_code){ 
            console.log('-------------------함수로 이동해서 값을 받는지', order_no, mtlty_name, p_code)
            this.$router.push({name:'orderInfo', params : {order_no:order_no, mtlty_name:mtlty_name, p_code:p_code}}); 
        }, 
        filteredResult(){ 
            //console.log(this.gridApi, this.colDefs, this.rowData.filter()); 
            //console.log('거래처명 조회결과',this.filter_mtlty_name);
            this.filteredRowData = this.rowData.filter((row)=>{ 
                // console.log('주문번호',row.order_no);
                // console.log('거래처',row.mtlty_name);
                let orderDate = row.order_date; 
                let newDete = row.dete; 
                let filter_order_date = !this.filter_order_date || orderDate >= this.filter_order_date;
                let filter_dete = !this.filter_dete || newDete >= this.filter_dete;
                console.log('거래처명 조회결과',this.filter_mtlty_name);
                console.log(row);
                console.log((!this.filter_mtlty_name || row.mtlty_name.includes(this.filter_mtlty_name)));
                return( 
                    (!this.filter_order_no || row.order_no.includes(this.filter_order_no)) && 
                    (!this.filter_mtlty_name || row.mtlty_name.includes(this.filter_mtlty_name)) && 
                    filter_order_date && filter_dete
                ) ;
            });
            console.log('필터링 결과는',this.filteredRowData);
        }, 
        resetFilter(){
            this.filter_order_no = ''; 
            this.filter_mtlty_name = ''; 
            this.filter_order_date = ''; 
            this.filter_dete = ''; 
            this.filteredRowData = this.rowData; 
        },
        onBtnExportDataAsCsvLotList(){
            console.log('작동');
            this.gridApi.exportDataAsCsv();
        } 
    } 
}; 
</script>

<style scoped>
input {
    width: 220px;
}
button{
    margin-left : 5px;
    margin-right: 5px;
    line-height: 15px;
}
</style>