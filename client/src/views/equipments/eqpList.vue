<template>
    <div>
        <v-card class="mx-auto card-custom-1" style="border-radius:13px; text-align: center; margin-bottom: 30px;">
            <template v-slot:title>
                <span class="font-weight-black">
                    설비 상태 조회
                </span>
            </template>
        </v-card>
        <div>
            <v-card-text class="bg-surface-light pt-4">
                <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 525px"
                    @grid-ready="onGridReady" class="ag-theme-alpine" overlayNoRowsTemplate="결과 없음">
                </ag-grid-vue>
            </v-card-text>
        </div>
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
            { field: "eqp_nm", headerName: "설비명" },
            { field: "model_nm", headerName: "모델명" },
            { field: "eqp_run", headerName: "가동여부", flex: 0.75 },
            { field: "model_tp", headerName: "온도", flex: 0.5 },
            { field: "procs_time", headerName: "가동시간 (분)", flex: 0.75 },
            { field: "procs_nm", headerName: "실행작업", flex: 0.75 }
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
                if (eqp_run.data.begin_time != null && eqp_run.data.end_time == null) {
                    this.eqpList[i].eqp_run = "가동중";
                    this.eqpList[i].procs_nm = eqp_run.data.procs_nm;
                    let start_time = new Date(eqp_run.data.begin_time);
                    let today = new Date();
                    this.eqpList[i].procs_time = ((today - start_time) / 1000 / 60).toFixed(2)
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
