<template>
    <div>
        <v-card class="mx-auto card-custom-1" style="border-radius:13px; text-align: center;">
            <template v-slot:title>
                <span class="font-weight-black">
                    공정 흐름도 {{ header }}
                </span>
            </template>
        </v-card>
        <v-card-text class="bg-surface-light pt-4">
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
                            총 소요시간 (분)
                        </th>
                        <th style="width: 25%;">
                            <button type="button" class="btn btn-primary"
                                style="color: white; margin: 2px; padding: 2px; width: 75px;"
                                @click="submit_btn()">저장</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input style="background-color:lightsteelblue;" type="text" v-model="prd_code"
                                @click="input_click()">
                        </td>
                        <td>
                            <input style="background-color: lightsteelblue;" type="text" v-model="prd_nm">
                        </td>
                        <td>
                            {{ all_time }} 분
                        </td>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style="height: 300px;" v-show="input_div">
                <ag-grid-vue :rowData="rowData_search" :columnDefs="colDefs_search" :gridOptions="gridOptions_search"
                    style="height: 250px; width: 30%; margin-right: auto;" class="ag-theme-alpine"
                    overlayNoRowsTemplate="결과 없음">
                </ag-grid-vue>
            </div>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th style="width: 15%; font-size: 20px;">
                            공정 순서
                        </th>
                        <th style="width: 65%;">
                        </th>
                        <th style="width: 10%;">
                            <button type="button" class="btn btn-primary"
                                style="color: white; margin: 2px; padding: 2px; width: 75px;" @click="add_btn()">행
                                추가</button>
                        </th>
                        <th style="width: 10%;">
                            <button type="button" class="btn btn-danger"
                                style="color: white; margin: 2px; padding: 2px; width: 75px;" @click="delete_btn()">행
                                삭제</button>
                        </th>
                    </tr>
                </thead>
            </table>
            <div>
                <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" rowSelection="multiple"
                    style="height: 500px" @grid-ready="onGridReady" class="ag-theme-alpine"
                    overlayNoRowsTemplate="결과 없음">
                </ag-grid-vue>
            </div>
        </v-card-text>
    </div>
    <span style="margin-left:20px; margin-bottom:0; margin-top:0;">
        <div class="modal-wrap" @click="modal_close_btn()" v-show="modal_on_off">
            <div class="modal-container" @click.stop="">
                <div>
                    <p style="text-align: center; font-size: 30px; font-weight: bold;">
                        {{ modal_header }}
                    </p>
                </div>
                <div id="search-bar" style="height: 375px;">
                    <ag-grid-vue :rowData="modal_rowData" :columnDefs="modal_colDefs" :gridOptions="modal_gridOptions"
                        style="height: 325px" class="ag-theme-alpine" overlayNoRowsTemplate="결과 없음">
                    </ag-grid-vue>
                </div>
            </div>
        </div>
    </span>
</template>

<script>
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
            rowData: [
                {
                    index: '1',
                    procs_ordr_no: '0',
                    expect_reqre_time: '0',
                    procs_nm: '입력',
                    mtril_nm: '선택',
                    usgqty: '0',
                    eqp_code: '선택'
                }
            ],
            colDefs: [],
            prd_code: '',
            prd_nm: '',
            all_time: '--',
            index_num: 2,
            delete_num: '',
            toast: '',
            header: '',
            del_edit: 0,
            input_div: false,
            rowData_search: [],
            colDefs_search: [],
            modal_on_off: false,
            modal_header: '',
            modal_rowData: [],
            modal_colDefs: []
        };
    },
    created() {
        this.prd_code = this.$route.query.prd_code;
        if (this.prd_code != null) {
            this.header = '수정';
            this.getProcsDetail(this.prd_code);
            this.getProcsDetailTop(this.prd_code);
            this.del_edit = this.rowData.length;
        } else {
            this.header = '등록';
        }
        this.colDefs = [
            { field: "index", headerName: "인덱스", checkboxSelection: true },
            { field: "procs_ordr_no", headerName: "공정순서번호", editable: true },
            { field: "expect_reqre_time", headerName: "예상소요시간 (분)", editable: true },
            { field: "procs_nm", headerName: "시행작업", editable: true },
            { field: "mtril_nm", headerName: "재료명" },
            { field: "usgqty", headerName: "재료양", editable: true },
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
            },
            onCellClicked: (CellClickedEvent) => this.inputModal(CellClickedEvent)
        };
        this.toast = useToast();
        this.colDefs_search = [
            { field: "prdlst_code", headerName: "품목코드" },
            { field: "prdist_name", headerName: "품목명" }
        ];
        this.gridOptions_search = {
            columnDefs: this.orderColDefs,
            defaultColDef: {
                filter: true,
                flex: 1,
                minWidth: 10
            },
            onCellClicked: (CellClickedEvent) => this.autoInput(CellClickedEvent.data)
        };
        this.modal_gridOptions = {
            columnDefs: this.orderColDefs,
            defaultColDef: {
                filter: true,
                flex: 1,
                minWidth: 10
            },
            onCellClicked: (CellClickedEvent) => this.outputModal(CellClickedEvent.data)
        }
    },
    components: {
        AgGridVue // Add Vue Data Grid component
    },
    methods: {
        onGridReady(params) {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        },
        add_btn() {
            let new_sample = {
                index: this.index_num,
                procs_ordr_no: '0',
                expect_reqre_time: '0',
                procs_nm: '입력',
                mtril_nm: '선택',
                usgqty: '0',
                eqp_code: '선택'
            };
            this.index_num = this.index_num + 1;
            this.rowData = [...this.rowData, new_sample];
        },
        delete_btn() {
            const selectedNodes = this.gridApi.getSelectedNodes();
            for (let i = 0; i < selectedNodes.length; i++) {
                let result_arr = [];
                for (let j = 0; j < this.rowData.length; j++) {
                    if (this.rowData[j].index == selectedNodes[i].data.index) {
                        continue;
                    }
                    result_arr = [...result_arr, this.rowData[j]];
                }
                this.rowData = result_arr;
            }
        },
        async submit_btn() {
            let submit_check = 1;
            let list_1 = await axios.get(`${ajaxUrl}/prd_code_bom_cmpds_list/${this.prd_code}`);
            let bom_list = list_1.data;
            for (let i = 0; i < bom_list.length; i++) {
                let sum = 0;
                for (let j = 0; j < this.rowData.length; j++) {
                    if (this.rowData[j].mtril_nm == bom_list[i].cmpds_prdlst_name) {
                        sum = sum + parseInt(this.rowData[j].usgqty);
                    }
                }
                if (bom_list[i].cnsum_count != sum) {
                    submit_check = 0;
                }
            }
            if (submit_check == 0) {
                this.toast.add({ severity: 'error', summary: '실패', detail: 'BOM이랑 총 수량이 같지 않습니다.', life: 3000 });
            } else if (submit_check == 1) {
                if (this.$route.query.prd_code != null) {
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
                    this.$router.push({ name: 'procsFlowchartDetail', params: { prd_code: this.prd_code } });
                }

                let bom_code = await axios.get(`${ajaxUrl}/procsFlowchartSearchBom/${this.prd_code}`)
                    .catch(err => console.log(err))
                let check_code = [];
                for (let i = 0; i < this.rowData.length; i++) {
                    let procs_flowchart_insert = [
                        this.prd_code + '-' + this.rowData[i].procs_ordr_no,
                        this.rowData[i].procs_nm,
                        this.prd_code,
                        this.prd_nm,
                        this.rowData[i].procs_ordr_no,
                        this.rowData[i].expect_reqre_time,
                        bom_code.data.bom_code
                    ];
                    let insert_row = 0;
                    for (let j = 0; j < check_code.length + 1; j++) {
                        if (this.rowData[i].procs_ordr_no == check_code[j]) {
                            insert_row = 1;
                        }
                    }
                    if (insert_row == 0) {
                        let result_1 = await axios.post(`${ajaxUrl}/procsFlowchartInsert`, procs_flowchart_insert)
                            .catch(err => console.log(err));
                        check_code = [...check_code, this.rowData[i].procs_ordr_no];
                    }

                    let mtril_code = await axios.get(`${ajaxUrl}/procsFlowchartSearchmtnm/${this.rowData[i].mtril_nm}`)
                        .catch(err => console.log(err))
                    let procs_matrl_insert = [
                        this.prd_code + '-' + this.rowData[i].procs_ordr_no,
                        this.rowData[i].procs_nm,
                        mtril_code.data.mtril_code,
                        this.rowData[i].mtril_nm,
                        this.rowData[i].usgqty
                    ]
                    let result_2 = await axios.post(`${ajaxUrl}/procsMatrlInsert`, procs_matrl_insert)
                        .catch(err => console.log(err));

                    let procs_mchn_insert = [
                        this.prd_code + '-' + this.rowData[i].procs_ordr_no,
                        this.rowData[i].eqp_code
                    ]
                    let result_3 = await axios.post(`${ajaxUrl}/procsMchnInsert`, procs_mchn_insert)
                        .catch(err => console.log(err));
                }
                //this.$router.push({ name: 'procsFlowchartDetail', params: { prd_code: this.prd_code } });
                location.href = `/standardInfo/procsFlowchartDetail/${this.prd_code}`;
            }
        },
        async getProcsDetail(prd_code) {
            let result = await axios.get(`${ajaxUrl}/procsFlowchartDetail/${prd_code}`)
                .catch(err => console.log(err));
            this.eqpList = result.data;
            for (let i = 0; i < this.eqpList.length; i++) {
                this.eqpList[i].index = i + 1;
            }
            this.rowData = this.eqpList;
            this.index_num = this.rowData.length + 1
        },
        async getProcsDetailTop(prd_code) {
            let result = await axios.get(`${ajaxUrl}/procsFlowchartDetailTop/${prd_code}`)
                .catch(err => console.log(err));
            this.prd_code = result.data.prd_code;
            this.prd_nm = result.data.prd_nm;
            this.all_time = result.data.all_time;
        },
        async input_click() {
            let result = await axios.get(`${ajaxUrl}/prd_code_bom_all_search`)
                .catch(err => console.log(err));
            this.rowData_search = result.data;
            this.input_div = true;
            if (this.prd_code != null) {
                let result = await axios.get(`${ajaxUrl}/prd_code_bom_search/${this.prd_code}`)
                    .catch(err => console.log(err));
                this.rowData_search = result.data;
            }
        },
        async input_change(input) {
            if (input == '') {
                let result = await axios.get(`${ajaxUrl}/prd_code_bom_all_search`)
                    .catch(err => console.log(err));
                this.rowData_search = result.data;
            } else {
                let result = await axios.get(`${ajaxUrl}/prd_code_bom_search/${input}`)
                    .catch(err => console.log(err));
                this.rowData_search = result.data;
            }
        },
        async autoInput(event) {
            this.prd_code = event.prdlst_code;
            this.prd_nm = event.prdist_name;
            this.input_div = false;
        },
        async inputModal(event) {
            if (event.colDef.headerName === "재료명") {
                this.modal_on_off = true;
                this.modal_header = '재료 선택';
                this.modal_colDefs = [
                    { field: "cmpds_prdlst_code", headerName: "소모품목코드" },
                    { field: "cmpds_prdlst_name", headerName: "소모품목명" },
                    { field: "unit", headerName: "단위" },
                    { field: "cnsum_count", headerName: "재료양" },
                    { field: "index", hide: true, suppressToolPanel: true },
                    { field: "info", hide: true, suppressToolPanel: true }
                ];
                let list = await axios.get(`${ajaxUrl}/prd_code_bom_cmpds_list/${this.prd_code}`);
                this.modal_rowData = list.data;
                let nothing = {
                    cmpds_prdlst_code: null,
                    cmpds_prdlst_name: '없음',
                    unit: 0,
                    cnsum_count: 0
                }
                this.modal_rowData.push(nothing)
                for (let i = 0; i < this.modal_rowData.length; i++) {
                    this.modal_rowData[i].index = event.data.index;
                    this.modal_rowData[i].info = "mtril"
                }
            } else if (event.colDef.headerName === "작업기기") {
                this.modal_on_off = true;
                this.modal_header = '기기 선택'
                this.modal_colDefs = [
                    { field: "eqp_code", headerName: "설비코드" },
                    { field: "eqp_nm", headerName: "설비명" },
                    { field: "model_nm", headerName: "모델명" },
                    { field: "index", hide: true, suppressToolPanel: true },
                    { field: "info", hide: true, suppressToolPanel: true }
                ];
                let list = await axios.get(`${ajaxUrl}/equip/eqp_all_list`);
                this.modal_rowData = list.data;
                for (let i = 0; i < this.modal_rowData.length; i++) {
                    this.modal_rowData[i].index = event.data.index;
                    this.modal_rowData[i].info = "equip"
                }

            } else {
                this.modal_on_off = false;
            }
        },
        modal_close_btn() {
            this.modal_on_off = !this.modal_on_off;
        },
        outputModal(event) {
            if (event.info === "mtril") {
                for (let i = 0; i < this.rowData.length; i++) {
                    if (this.rowData[i].index == event.index) {
                        this.rowData[i].mtril_nm = event.cmpds_prdlst_name;
                        if (event.cmpds_prdlst_name == '없음') {
                            this.rowData[i].usgqty = 0;
                        }
                        break;
                    }
                }
                this.rowData = [...this.rowData];
                this.modal_on_off = false;
            } else if (event.info === "equip") {
                for (let i = 0; i < this.rowData.length; i++) {
                    if (this.rowData[i].index == event.index) {
                        this.rowData[i].eqp_code = event.eqp_code;
                        break;
                    }
                }
                this.rowData = [...this.rowData];
                this.modal_on_off = false;
            }
        }
    },
    watch: {
        prd_code: function (input) {
            this.input_change(input)
        }
    }
};
</script>