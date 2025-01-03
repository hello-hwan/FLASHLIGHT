<template>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 80%; font-size: 30px;">
                        공정 흐름도 상세 조회
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
                        <button type="button" class="btn btn-primary" style="color: white;"
                            @click="edit_btn()">수정</button>
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
                        <button type="button" class="btn btn-danger" style="color: white;"
                            @click="delete_btn()">삭제</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div style="height: 60px; background-color: lightgray; width: 50%; margin-left: auto;" v-show="delete_div">
            <p>아래에 품목코드를 입력하고 버튼을 누르면 삭제합니다.</p>
            <input style="background-color: lightsteelblue;" type="text" v-model="delete_prd_code" size="9">
            <button type="button" class="btn btn-primary" style="color: white;"
                @click="delete_cansle_button()">취소</button>
            <button type="button" class="btn btn-danger" style="color: white;" @click="real_delete_btn()">삭제</button>
        </div>
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
            prd_code: '',
            input_div: false,
            rowData_search: [],
            colDefs_search: [],
            delete_div: false,
            delete_prd_code: ''
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
        delete_btn() {
            this.delete_div = true;
        },
        delete_cansle_button() {
            this.delete_prd_code = '';
            this.delete_div = false;
        },
        async real_delete_btn() {
            if (this.delete_prd_code == this.prd_code) {
                let result = await axios.get(`${ajaxUrl}/prdCodeToProcsCode/${this.prd_code}`)
                    .catch(err => console.log(err));
                for (let i = 0; i < result.data.length; i++) {
                    let result_1 = await axios.delete(`${ajaxUrl}/ProcsCodeToDeleteMchn/${result.data[i].procs_code}`)
                        .catch(err => console.log(err));
                    let result_2 = await axios.delete(`${ajaxUrl}/ProcsCodeToDeleteMatrl/${result.data[i].procs_code}`)
                        .catch(err => console.log(err));
                    let result_3 = await axios.delete(`${ajaxUrl}/ProcsCodeToDeleteFlowchart/${result.data[i].procs_code}`)
                        .catch(err => console.log(err));
                }
                this.$router.push({ name: 'procsFlowchartList' });
            } else {
                this.delete_prd_code = '';
                this.toast.add({ severity: 'error', summary: '삭제 실패', detail: '품목코드를 잘못 입력했습니다.', life: 3000 });
            }
        },
        edit_btn() {
            this.$router.push({ name: 'procsFlowchartinsert', query: { prd_code: this.prd_code } });
        },
        input_click() {
            this.input_div = true;
        },
        async input_change() {
            let result = await axios.get(`${ajaxUrl}/prd_code_search/${this.search_prd_code}`)
                .catch(err => console.log(err));;
            this.rowData_search = result.data;
        },
        goToDetail(prd_code) {
            if (this.prd_code == prd_code) {
                this.toast.add({ severity: 'error', summary: '검색 결과', detail: '현재 페이지가 검색 페이지입니다.', life: 3000 });
            }
            this.$router.push({ name: 'procsFlowchartDetail', params: { prd_code: prd_code } });
        }
    },
    watch: {
        search_prd_code: function (input) {
            this.input_change(input)
        }
    }
};
</script>

<style scoped>
table * {
    text-align: center;
}
</style>