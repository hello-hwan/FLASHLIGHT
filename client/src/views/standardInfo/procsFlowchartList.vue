<template>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 75%; font-size: 30px;">
                        공정 흐름도 조회
                    </th>
                    <th style="width: 9%;">
                        품목코드 검색
                    </th>
                    <th style="width: 9%;">
                        <input style="background-color: lightsteelblue;" type="text" v-model="search_prd_code" size="9">
                    </th>
                    <th style="width: 7%;">
                        <button type="button" class="btn btn-outline-secondary" @click="search_btn()">검색</button>
                    </th>
                </tr>
            </thead>
        </table>
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

import { useToast } from 'primevue/usetoast';

export default {
    name: 'App',
    data() {
        return {
            eqpList: [],
            rowData: [],
            colDefs: [], 
            search_prd_code: '', 
            toast: ''
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
        this.toast = useToast();
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
                this.eqpList[i].details = "클릭";
            }
            this.rowData = this.eqpList;
        },
        goToDetail(prd_code) {
            this.$router.push({ name: 'procsFlowchartDetail', params: { prd_code: prd_code } });
        },
        async search_btn() {
            if (this.search_prd_code.length < 1) {
                this.toast.add({ severity: 'error', summary: '실패', detail: '검색어를 입력해주세요.', life: 3000 });
            } else {
                let result = await axios.get(`${ajaxUrl}/procsFlowchartDetailTop/${this.search_prd_code}`)
                    .catch(err => console.log(err));
                if (result.data != "") {
                    this.toast.add({ severity: 'success', summary: '성공', detail: '검색에 성공했습니다.', life: 3000 });
                    this.$router.push({ name: 'procsFlowchartDetail', params: { prd_code: this.search_prd_code } });
                } else {
                    this.toast.add({ severity: 'error', summary: '실패', detail: '검색 결과가 없습니다.', life: 3000 });
                }
            }
        }
    }
};
</script>
