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
            colDefs: [], 
        };
    },
    created() {
        this.getEqpList();
        this.colDefs = [
            { field: "eqp_code", headerName: "설비코드" },
            { field: "model_nm", headerName: "모델명" },
            { field: "eqp_run", headerName: "가동여부" },
            { field: "model_tp", headerName: "온도" },
            { field: "procs_time", headerName: "가동시간" },
            { field: "procs_nm", headerName: "실행작업" }
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
        onGridReady(params) {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        },
        async getEqpList() {
            let result = await axios.get(`${ajaxUrl}/equip/eqp_list`)
                .catch(err => console.log(err));
            this.eqpList = result.data;
            for (let i = 0; i < this.eqpList.length; i++) {
                let eqp_run = await axios.get(`${ajaxUrl}/equip/eqp_list_prod/${this.eqpList[i].eqp_code}`)
                if (eqp_run.data.begin_time != "" && eqp_run.data.end_time == "") {
                    this.eqpList[i].eqp_run = "가동중";
                    this.eqpList[i].procs_nm = eqp_run.data.procs_nm;
                    let start_time = new Date(eqp_run.data.begin_time);
                    let today = new Date();
                    this.eqpList[i].procs_time = ((today - start_time) / 1000 / 60 / 60).toFixed(2)
                } else {
                    this.eqpList[i].eqp_run = "비가동";
                    this.eqpList[i].procs_nm = "-";
                    this.eqpList[i].procs_time = "-";
                }
            }
            this.rowData = this.eqpList;
        }
    }
};
</script>
