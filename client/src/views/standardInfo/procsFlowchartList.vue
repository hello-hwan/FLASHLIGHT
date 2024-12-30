<template>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 80%; font-size: 30px;">
                        공정 흐름도 조회
                    </th>
                    <th style="width: 10%;">
                        품목코드 검색
                    </th>
                    <th style="width: 10%;">
                        <input style="background-color: lightsteelblue;" type="text" v-model="search_prd_code" size="9"
                            @click="input_click()">
                    </th>
                </tr>
            </thead>
        </table>
        <div style="height: 300px;" v-show="input_div">
            <ag-grid-vue :rowData="rowData_search" :columnDefs="colDefs_search" :gridOptions="gridOptions_search"
                style="height: 250px; width: 30%; margin-left: auto;" @grid-ready="onGridReady" class="ag-theme-alpine">
            </ag-grid-vue>
        </div>
        <div>
            <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 500px"
                @grid-ready="onGridReady" class="ag-theme-alpine">
            </ag-grid-vue>
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
            search_prd_code: '',
            input_div: false,
            rowData_search: [],
            colDefs_search: []
        };
    },
    created() {
        this.getProcsList();
        this.colDefs = [
            { field: "prd_code", headerName: "품목코드" },
            { field: "prd_nm", headerName: "품목명" },
            { field: "all_time", headerName: "총 소요시간" },
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
        this.colDefs_search = [
            { field: "prd_code", headerName: "품목코드" },
            { field: "prd_nm", headerName: "품목명" }
        ];
        this.gridOptions_search = {
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
                this.eqpList[i].all_time = this.eqpList[i].all_time + " 시간";
            }
            this.rowData = this.eqpList;
        },
        goToDetail(prd_code) {
            this.$router.push({ name: 'procsFlowchartDetail', params: { prd_code: prd_code } });
        },
        input_click() {
            this.input_div = true;
        },
        async input_change() {
            let result = await axios.get(`${ajaxUrl}/prd_code_search/${this.search_prd_code}`)
                .catch(err => console.log(err));;
            this.rowData_search = result.data;
        }
    },
    watch: {
        search_prd_code: function (input) {
            this.input_change(input)
        }
    }
};
</script>
