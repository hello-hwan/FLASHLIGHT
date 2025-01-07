<template>
    <div>
        <v-card class="mx-auto card-custom-1" style="border-radius:13px; text-align: center; margin-bottom: 30px;">
            <template v-slot:title>
                <span class="font-weight-black">
                    미점검 설비 조회
                </span>
            </template>
        </v-card>
        <div>
            <v-card-text class="bg-surface-light pt-4">
                <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 500px"
                    @grid-ready="onGridReady" class="ag-theme-alpine" overlayNoRowsTemplate="결과 없음">
                </ag-grid-vue>
            </v-card-text>
        </div>
    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import useDateUtils from '@/utils/useDates.js';

export default {
    name: 'App',
    data() {
        return {
            notEqpList: [],
            rowData: [],
            colDefs: [],
        };
    },
    created() {
        this.getNotEqpList();
        this.colDefs = [
            { field: "fx_code", headerName: "일정코드", hide: true, suppressToolPanel: true },
            { field: "eqp_code", headerName: "설비코드" },
            { field: "model_nm", headerName: "모델명" },
            { field: "chck_nm", headerName: "점검명" },
            { field: "chck_knd", headerName: "점검종류" },
            { field: "chck_de", headerName: "점검예정날짜" },
            { field: "chck_time", headerName: "점검시간" },
            { field: "not_chck_resn", headerName: "미점검 사유" }
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
        async getNotEqpList() {
            let result = await axios.get(`${ajaxUrl}/equip/not_check_list`)
                .catch(err => console.log(err));
            this.notEqpList = result.data;
            for (let i = 0; i < this.notEqpList.length; i++) {
                this.notEqpList[i].chck_de = useDateUtils.dateFormat(this.notEqpList[i].chck_de, "yyyy-MM-dd")
            }
            this.rowData = this.notEqpList;
        }
    }
};
</script>
