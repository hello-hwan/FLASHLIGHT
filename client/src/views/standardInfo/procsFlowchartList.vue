<template>
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 500px"
            @grid-ready="onGridReady" class="ag-theme-alpine">
        </ag-grid-vue>
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
            eqpList: [],
            rowData: [],
            colDefs: []
        };
    },
    created() {
        this.getProcsList();
        this.colDefs = [
            { field: "prd_code", headerName: "품목코드" },
            { field: "prd_nm", headerName: "품목명" },
            { field: "all_time", headerName: "총 소요시간" },
            { field: "details", headerName: "상세보기" }
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
            onCellClicked: (CellClickedEvent) => this.goToDetail(CellClickedEvent.data.prd_code)
        };
    },
    components: {
        AgGridVue // Add Vue Data Grid component
    },
    methods: {
        onGridReady(params) {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        },
        async getProcsList() {
            let result = await axios.get(`${ajaxUrl}/procsFlowchartList`)
                .catch(err => console.log(err));
            this.eqpList = result.data;
            for (let i = 0; i < this.eqpList.length; i++) {
                this.eqpList[i].details = "클릭";
            }
            this.rowData = this.eqpList;
        },
        goToDetail(prd_code) {
            this.$router.push({ name : 'procsFlowchartDetail', params : { prd_code : prd_code }});
        }
    }
};
</script>
