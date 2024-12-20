<template>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 70%; font-size: 30px;">
                        점검 일자 상세 조회
                    </th>
                    <th style="width: 30%;">

                    </th>
                </tr>
            </thead>
        </table>
        <table class="table table-hover">
            <tbody>
                <tr>
                    <th style="width: 25%;">
                        점검명
                    </th>
                    <th style="width: 25%;">
                        {{ fx_code_list.chck_nm }}
                    </th>
                    <th style="width: 25%;">
                        모델명
                    </th>
                    <th style="width: 25%;">
                        {{ fx_code_list.model_nm }}
                    </th>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <th style="width: 25%;">
                        점검종류
                    </th>
                    <th style="width: 25%;">
                        {{ fx_code_list.chck_knd }}
                    </th>
                    <th style="width: 25%;">
                        담당자
                    </th>
                    <th style="width: 25%;">
                        {{ fx_code_list.charger }}
                    </th>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <th style="width: 25%;">
                        점검일자
                    </th>
                    <th style="width: 25%;">
                        {{ this.now_date }}
                    </th>
                    <th style="width: 25%;">
                        점검시간
                    </th>
                    <th style="width: 25%;">
                        {{ fx_code_list.chck_time }}
                    </th>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <th style="width: 25%;">
                        이전 점검일자
                    </th>
                    <th style="width: 25%;">
                        {{ fx_code_list.last_bgnde }}
                    </th>
                    <th style="width: 25%;">
                        다음 점검 예정일
                    </th>
                    <th style="width: 25%;">
                        {{ this.next_date }}
                    </th>
                </tr>
            </tbody>
        </table>
        <div>
            <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 200px; width: 100%;"
                @grid-ready="onGridReady" rowSelection="multiple" class="ag-theme-alpine">
            </ag-grid-vue>
        </div>
        <table class="table table-hover">
            <tbody>
                <tr>
                    <th style="width: 10%;">
                        <button type="button" class="btn btn-outline-primary" @click="add_btn()">행 추가</button>
                    </th>
                    <th style="width: 10%;">
                        <button type="button" class="btn btn-outline-danger" @click="delete_btn()">행 삭제</button>
                    </th>
                    <th style="width: 20%;">
                    </th>
                    <th style="width: 10%;">
                        <button type="button" class="btn btn-outline-warning" @click="not_check()">미점검</button>
                    </th>
                    <th style="width: 25%;">
                        최종 결과
                    </th>
                    <th style="width: 25%;">
                        <input style="background-color:lightsteelblue;" type="text" v-model="chck_sttus">
                    </th>
                </tr>
            </tbody>
        </table>
        <table class="table table-hover">
            <tbody>
                <tr>
                    <th style="width: 25%;">
                    </th>
                    <th style="width: 50%;">
                        <button type="button" class="btn btn-outline-success" @click="chck_fx_insert()">등록</button>
                    </th>
                    <th style="width: 25%;">
                    </th>
                </tr>
            </tbody>
        </table>
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
    data() {
        return {
            rowData: [
                {
                    index: '1',
                    iem_nm: '-',
                    mesure_value: '-',
                    stblt_at: '-'
                }
            ],
            colDefs: [],
            index: 2,
            fx_code: '',
            fx_code_list: {},
            now_date: '',
            next_date: '',
            chck_sttus: '입력하세요'
        }
    },
    created() {
        this.fx_code = this.$route.params.fx_code;
        console.log(this.fx_code)
        this.getFxCodeList(this.fx_code);
        this.colDefs = [
            { field: "index", headerName: "index", checkboxSelection: true },
            { field: "iem_nm", headerName: "점검 항목 명", editable: true },
            { field: "mesure_value", headerName: "측정 값", editable: true },
            { field: "stblt_at", headerName: "적합 여부", editable: true }
        ];

        let now = new Date();
        this.now_date = useDateUtils.dateFormat(now, "yyyy-MM-dd");
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
                index: this.index,
                iem_nm: '-',
                mesure_value: '-',
                stblt_at: '-'
            };
            this.index = this.index + 1;
            this.rowData = [...this.rowData, new_sample];
        },
        delete_btn() {
            const selectedNodes = this.gridApi.getSelectedNodes();
            for (let i = 0; i < selectedNodes.length; i++) {
                let result_arr = [];
                console.log(selectedNodes[i].data.index);
                for (let j = 0; j < this.rowData.length; j++) {
                    if (this.rowData[j].index == selectedNodes[i].data.index) {
                        continue;
                    }
                    result_arr = [...result_arr, this.rowData[j]];
                }
                this.rowData = result_arr;
            }
        },
        async getFxCodeList() {
            let result = await axios.get(`${ajaxUrl}/equip/fx_code_list/${this.fx_code}`)
                .catch(err => console.log(err));
            this.fx_code_list = result.data;
            this.fx_code_list.last_bgnde = useDateUtils.dateFormat(this.fx_code_list.last_bgnde, "yyyy-MM-dd");
            console.log(this.fx_code_list);
            let now = new Date();
            now.setDate(now.getDate() + this.fx_code_list.chck_cycle);
            this.next_date = useDateUtils.dateFormat(now, "yyyy-MM-dd");
        },
        async chck_fx_insert() {
            let list = [
                this.fx_code_list.eqp_code,
                this.fx_code_list.chck_nm,
                this.fx_code_list.chck_knd,
                this.chck_sttus,
                this.fx_code_list.charger,
                this.fx_code_list.chck_time,
                this.now_date,
                this.fx_code_list.last_bgnde
            ]
            console.log(list);
            let result = await axios.post(`${ajaxUrl}/equip/chck_fc_insert`, list)
                .catch(err => console.log(err));
            let now_fx_code = await axios.get(`${ajaxUrl}/equip/find_last_fx_code`)
                .catch(err => console.log(err));


            for (let i = 0; i < this.rowData.length; i++) {
                let chck_result_insert = [
                    now_fx_code.data.fx_code,
                    this.rowData[i].iem_nm,
                    parseInt(this.rowData[i].mesure_value),
                    this.rowData[i].stblt_at,
                ];
                console.log(chck_result_insert);
                let result = await axios.post(`${ajaxUrl}/equip/chck_result_insert`, chck_result_insert)
                .catch(err => console.log(err));
            }

        },
        async not_check() {
            
        }
    }
}
</script>