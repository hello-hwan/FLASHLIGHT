<template>
<div class="businessOrderListTitle">
        품질검사결과 조회
</div>  
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 500px"
            @grid-ready="onGridReady" class="ag-theme-alpine">
        </ag-grid-vue>
        <button type="button" class="btn btn-xs btn-info" @click="btn()">조회</button>
    </div>
</template>

<script>
//import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

export default {
    name: 'App',
    data() {
        return {            
            rowData: [],
            colDefs: [], 
            
        };
    },
    created() {
        this.getEqpList();
        this.colDefs = [
            { field: "prd_code", headerName: "품목코드" },
            { field: "mtril_check_code", headerName: "품질검사코드" },
            { field: "mtril_name", headerName: "자재명" },
            { field: "test_date", headerName: "검사일자" },
            { field: "pass_amount", headerName: "총 합격량" },
            { field: "error_amount", headerName: "불량량" },
            { field: "", headerName: "불량사유" }
        ];

        this.gridOptions = {
            columnDefs: this.orderColDefs,
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
        };
    },    
    components: {
        AgGridVue // Add Vue Data Grid component
    },
    methods: {
        async getEqpList() {
            
        }        
    }
};
</script>
