<template>

    <!-- 주문 조회 페이지 -->
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card class="mx-auto" style="border-radius: 13px;">

                    <!-- 페이지 이름 -->
                    <template v-slot:title>
                        <span class="font-weight-black">
                            주문 조회
                        </span>
                    </template>
                    <v-card-text class="bg-surface-light pt-4">

                        <!-- 거래처명, 주문일자, 납품일자, 주문번호로 주문 검색 -->
                        <div class="row g-3 align-items-center">
                            <div class="col-2">
                                <label for="orderListMtltyName" class="col-form-label">거래처 명</label>
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
                        </div>
                        <div class="row g-3 align-items-center">
                            <div class="col-2">
                                <label for="orderListDete" class="col-form-label">납품일자</label>
                            </div>
                            <div class="col-auto">
                                <input type="date" id="orderListDete" class="form-control" aria-describedby="passwordHelpInline" v-model="filter_dete">
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
                                ex ORDER-1
                                </span>
                            </div>
                        </div>

                        <!-- 버튼 위치 -->
                        <div style="margin-top:10px; margin-bottom:10px;">
                            <button type="button" class="btn btn-primary" @click="filteredResult()" style="color:white;">조회</button>
                            <button type="button" class="btn btn-secondary" @click="resetFilter()" style="color:white;">초기화</button>
                        </div>

                        <!-- ag grid 내용 출력 -->
                        <div>
                            <ag-grid-vue :rowData="filteredRowData" :columnDefs="colDefs" style="height: 519px" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
                            @grid-ready="onGridReady" rowSelection="multiple" overlayNoRowsTemplate="결과 없음">
                            </ag-grid-vue>
                        </div>
                        <button type="button" class="btn btn-primary" @click="onBtnExportDataAsCsvLotList()" style="margin-top:10px; color:white;">EXCEL 내보내기</button>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
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
        // 주문 조회 함수
        async getorderList() { 

            //주문 조회 요청, 결과값을 담아줌
            let result = await axios.get(`${ajaxUrl}/business/orderList`) 
                .catch(err => console.log(err)); 
            this.orderList = result.data; 
            console.log(result, result.data); 
            this.rowData = ref(this.orderList); 

            //필터링 된 결과를 rowData에 담아줌
            this.filteredRowData= this.rowData; 
        }, 
        customDateFormat1(params){ 
            return userDateUtils.dateFormat(params.data.order_date,'yyyy-MM-dd'); 
        }, 
        customDateFormat2(params){ 
            return userDateUtils.dateFormat(params.data.dete,'yyyy-MM-dd'); 
        }, 
        // 주문번호, 거래처명, 거래처 코드를 params로 보내면서 router로 주문 상세 페이지로 이동
        goToDetail(order_no, mtlty_name, p_code){ 
            this.$router.push({name:'orderInfo', params : {order_no:order_no, mtlty_name:mtlty_name, p_code:p_code}}); 
        }, 
        // 필터링 후 결과 조회
        filteredResult(){ 

            // 필터링 조건으로 조회 ( true일때만 반환)
            this.filteredRowData = this.rowData.filter((row)=>{ 

                // 주문일자를 담을 변수
                let orderDate = row.order_date; 

                //납품 일자를 담을 변수
                let newDete = row.dete; 

                // 주문 일자가 null이면 true, null이 아니면 입력된 주문일자보다 같거나 클때만 true
                let filter_order_date = !this.filter_order_date || orderDate >= this.filter_order_date;

                // 납품 일자가 null이면 true, null이 아니면 입력된 납품 일자보다 같거나 클때만 true
                let filter_dete = !this.filter_dete || newDete >= this.filter_dete;

                // 반환할 조건
                return( 
                    // 주문번호가 null이면 true, null이 아니면 해당 검색어를 포함해야 true
                    (!this.filter_order_no || row.order_no.includes(this.filter_order_no)) && 
                    // 거래처명이 null이면 true, null이 아니면 해당 검색어를 포함해야 true
                    (!this.filter_mtlty_name || row.mtlty_name.includes(this.filter_mtlty_name)) && 
                    // 바로 위에 정의된 boolean 타입 변수
                    filter_order_date && filter_dete
                ) ;
            });
            console.log('필터링 결과는',this.filteredRowData);
        }, 
        // 검색 조건 초기화
        resetFilter(){
            this.filter_order_no = ''; 
            this.filter_mtlty_name = ''; 
            this.filter_order_date = ''; 
            this.filter_dete = ''; 
            this.filteredRowData = this.rowData; 
        },
        // 엑셀로 내보내는 함수
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