<template>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 25%;">
                        품목코드
                    </th>
                    <th style="width: 25%;">
                        품목명
                    </th>
                    <th style="width: 25%;">
                        총 소요시간
                    </th>
                    <th style="width: 25%;">
                         
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        {{  }}
                    </td>
                    <td>
                        {{  }}
                    </td>
                    <td>
                        {{  }}
                    </td>
                    <td>
                        {{  }}
                    </td>
                </tr>
            </tbody>
        </table>
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
        let prd_code = this.$route.params.prd_code;
        this.getProcsDetail(prd_code);
        this.colDefs = [
            { field: "procs_ordr_no", headerName: "공정순서번호" },
            { field: "expect_reqre_time", headerName: "예상소요시간" },
            { field: "procs_nm", headerName: "시행작업" },
            { field: "mtril_nm", headerName: "재료명" }, 
            { field: "usgqty", headerName: "재료양" }, 
            { field: "eqp_code", headerName: "작업기기" }
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
            }
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
        async getProcsDetail(prd_code) {
            let result = await axios.get(`${ajaxUrl}/procsFlowchartDetail/${prd_code}`)
                .catch(err => console.log(err));
            this.eqpList = result.data;
            this.rowData = this.eqpList;
        }
    }
};
</script>

<style scoped>
table * {
    text-align: center;
}
</style>