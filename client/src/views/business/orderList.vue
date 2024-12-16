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
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
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
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
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
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
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
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>
            <div class="col-auto">
                <span class="form-text">
                Must be 8-20 characters long.
                </span>
            </div>
        </div>
        <div>
            <button type="button"class="btn btn-secondary">저장</button>
            <button type="button" class="btn btn-secondary">취소</button>
        </div>
    </div>
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 500px" class="ag-theme-alpine" :gridOptions="gridOptionsOrder">
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
            colDefs: '',
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
                filter: 'agTextColumnFilter',
                defaultColDef: {
                    filter: true,
                    flex: 1,
                    minWidth: 10
                }
            };
    },
    name: "App",
    components: {
        AgGridVue, // Add Vue Data Grid component
    },
    methods: {
        async getorderList() {
            let result = await axios.get(`${ajaxUrl}/business/orderList`)
                .catch(err => console.log(err));
            this.orderList = result.data;
            this.rowData = ref(this.orderList);
        },
        customDateFormat1(params){
            return userDateUtils.dateFormat(params.data.order_date,'yyyy-MM-dd');
        },
        customDateFormat2(params){
            return userDateUtils.dateFormat(params.data.dete,'yyyy-MM-dd');
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