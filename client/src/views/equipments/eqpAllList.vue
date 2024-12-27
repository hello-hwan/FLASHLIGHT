<template>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 70%; font-size: 30px;">
                        설비 전체 조회
                    </th>
                </tr>
            </thead>
        </table>
        <div>
            <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 525px"
                @grid-ready="onGridReady" class="ag-theme-alpine">
            </ag-grid-vue>
        </div>
        <table class="table table-hover">
            <tbody>
                <tr>
                    <th style="width: 50%;" colspan="6">
                        <button type="button" class="btn btn-success" style="color: white;" @click="chck_add_eqp()">설비 추가</button>
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
//import { ref } from 'vue';
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
            eqpAllList: [],
            rowData: [],
            colDefs: [],
        };
    },
    created() {
        this.getEqpList();
        this.colDefs = [
            { field: "eqp_code", headerName: "설비코드" },
            { field: "eqp_nm", headerName: "설비명" },
            { field: "model_nm", headerName: "모델명" },
            { field: "regsde", headerName: "등록일자" },
            { field: "mfbiz", headerName: "제조업체" },
            { field: "mg", headerName: "크기" }, 
            { field: "chck_cycle", headerName: "점검주기" }, 
            { field: "mnfctur_de", headerName: "제조일" }
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
            let result = await axios.get(`${ajaxUrl}/equip/eqp_all_list`)
                .catch(err => console.log(err));
            this.eqpAllList = result.data;
            for (let i = 0; i < this.eqpAllList.length; i++) {
                this.eqpAllList[i].regsde = useDateUtils.dateFormat(this.eqpAllList[i].regsde, "yyyy-MM-dd");
                this.eqpAllList[i].mnfctur_de = useDateUtils.dateFormat(this.eqpAllList[i].mnfctur_de, "yyyy-MM-dd");
            }
            this.rowData = this.eqpAllList;
        }, 
        chck_add_eqp() {
            this.$router.push({ name: 'addEqp' });
        }
    }
};
</script>
