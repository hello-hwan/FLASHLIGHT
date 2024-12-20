<template>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 70%; font-size: 30px;">
                        공정 흐름도 상세 조회
                    </th>
                    <th style="width: 10%;">
                        품목코드 검색 :
                    </th>
                    <th style="width: 15%;">
                        <input style="background-color: lightsteelblue;" type="text" v-model="search_prd_code">
                    </th>
                    <th style="width: 5%;">
                        <button type="button" class="btn btn-outline-secondary" @click="search_btn()">검색</button>
                    </th>
                </tr>
            </thead>
        </table>
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
                        <button type="button" class="btn btn-outline-primary" @click="edit_btn()">수정</button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        {{ this.topTable.prd_code }}
                    </td>
                    <td>
                        {{ this.topTable.prd_nm }}
                    </td>
                    <td>
                        {{ this.topTable.all_time }} 시간
                    </td>
                    <td>
                        <button type="button" class="btn btn-outline-danger" @click="delete_btn()">삭제</button>
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

import { useToast } from 'primevue/usetoast';

export default {
    name: 'App',
    data() {
        return {
            eqpList: [],
            rowData: [],
            colDefs: [],
            topTable: {},
            search_prd_code: '',
            toast: '',
            prd_code: ''
        };
    },
    created() {
        this.prd_code = this.$route.params.prd_code;
        this.getProcsDetail(this.prd_code);
        this.getProcsDetailTop(this.prd_code);
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
        async getProcsDetail(prd_code) {
            let result = await axios.get(`${ajaxUrl}/procsFlowchartDetail/${prd_code}`)
                .catch(err => console.log(err));
            this.eqpList = result.data;
            for (let i = 0; i < this.eqpList.length; i++) {
                this.eqpList[i].expect_reqre_time = this.eqpList[i].expect_reqre_time + " 시간";
            }
            this.rowData = this.eqpList;
        },
        async getProcsDetailTop(prd_code) {
            let result = await axios.get(`${ajaxUrl}/procsFlowchartDetailTop/${prd_code}`)
                .catch(err => console.log(err));
            this.topTable = result.data;
        },
        async search_btn() {
            if (this.search_prd_code.length < 1) {
                this.toast.add({ severity: 'error', summary: '실패', detail: '검색어를 입력해주세요.', life: 3000 });
            } else {
                let result = await axios.get(`${ajaxUrl}/procsFlowchartDetailTop/${this.search_prd_code}`)
                    .catch(err => console.log(err));
                if (result.data != "") {
                    this.toast.add({ severity: 'success', summary: '성공', detail: '검색에 성공했습니다.', life: 3000 });
                    this.getProcsDetail(this.search_prd_code);
                    this.getProcsDetailTop(this.search_prd_code);
                } else {
                    this.toast.add({ severity: 'error', summary: '실패', detail: '검색 결과가 없습니다.', life: 3000 });
                }
            }
        },
        async delete_btn() {
            console.log("delete")
            let result = await axios.get(`${ajaxUrl}/prdCodeToProcsCode/${this.prd_code}`)
                .catch(err => console.log(err));
            for (let i = 0; i < result.data.length; i++) {
                console.log(result.data[i].procs_code)
                let result_1 = await axios.delete(`${ajaxUrl}/ProcsCodeToDeleteMchn/${result.data[i].procs_code}`)
                    .catch(err => console.log(err));
                let result_2 = await axios.delete(`${ajaxUrl}/ProcsCodeToDeleteMatrl/${result.data[i].procs_code}`)
                    .catch(err => console.log(err));
                let result_3 = await axios.delete(`${ajaxUrl}/ProcsCodeToDeleteFlowchart/${result.data[i].procs_code}`)
                    .catch(err => console.log(err));
            }
            this.$router.push({ name: 'procsFlowchartList' });
        },
        edit_btn() {
            console.log("edit")
            this.$router.push({ name: 'procsFlowchartinsert', query: { prd_code: this.prd_code } });
        },
    }
};
</script>

<style scoped>
table * {
    text-align: center;
}
</style>