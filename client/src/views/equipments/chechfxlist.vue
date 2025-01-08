<template>
    <div>
        <v-card class="mx-auto card-custom-1" style="border-radius:13px; margin-bottom: 30px;">
            <template v-slot:title>
                <span class="font-weight-black" style="display: flex; justify-content: center;">
                    점검 일자 상세 조회
                </span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
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
                                <input style="background-color:lightsteelblue; text-align: center;" type="text"
                                    v-model="fx_code_list.charger">
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
                                <input style="background-color:lightsteelblue; text-align: center;" type="text"
                                    v-model="fx_code_list.chck_time">
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
            </v-card-text>
        </v-card>

        <v-card-text class="bg-surface-light pt-4">
            <div>
                <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions"
                    style="height: 310px; width: 100%;" @grid-ready="onGridReady" rowSelection="multiple"
                    class="ag-theme-alpine" overlayNoRowsTemplate="결과 없음">
                </ag-grid-vue>
            </div>
            <table class="table table-hover">
                <tbody>
                    <tr>
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
                        <th style="width: 35%;">
                            <input style="background-color:lightsteelblue;" type="text" size="35" v-model="not_check">
                        </th>
                        <th style="width: 10%;">
                            <button type="button" class="btn btn-warning"
                                style="color: white; margin: 2px; padding: 2px; width: 75px;"
                                @click="not_check_btn()">미점검</button>
                        </th>
                        <th style="width: 10%;">
                            <button type="button" class="btn btn-danger"
                                style="color: white; margin: 2px; padding: 2px; width: 75px;"
                                @click="not_opr_btn()">미가동</button>
                        </th>
                        <th style="width: 6%; font-size: 15px; text-align: center; vertical-align: middle;">
                            최종
                        </th>
                        <th style="width: 19%;">
                            <select @change='select_change($event)' class="form-select"
                                aria-label="Default select example" style="text-align: center;">
                                <option selected>결과</option>
                                <option value="합격">합격</option>
                                <option value="불합격">불합격</option>
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th style="width: 50%;" colspan="7">
                            <button type="button" class="btn btn-success"
                                style="color: white; margin: 2px 2px 2px 90%; padding: 2px; width: 75px;"
                                @click="chck_fx_insert()">등록</button>
                        </th>
                    </tr>
                </tbody>
            </table>
        </v-card-text>
    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import useDateUtils from '@/utils/useDates.js';
import { useStore } from 'vuex';

export default {
    data() {
        return {
            rowData: [],
            colDefs: [],
            index: 2,
            fx_code: '',
            fx_code_list: {},
            now_date: '',
            next_date: '',
            chck_sttus: '',
            not_check: '',
            store: ''
        }
    },
    created() {
        this.fx_code = this.$route.params.fx_code;
        this.getFxCodeList(this.fx_code);
        this.colDefs = [
            { field: "index", headerName: "index", checkboxSelection: true, flex: 0.5 },
            { field: "iem_nm", headerName: "점검 항목 명", editable: true },
            { field: "mesure_value", headerName: "측정 값", editable: true },
            {
                field: "stblt_at", headerName: "적합 여부", editable: true,
                cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['합격', '불합격'] }
            }
        ];
        let now = new Date();
        this.now_date = useDateUtils.dateFormat(now, "yyyy-MM-dd");
        this.gridOptions = {
            columnDefs: this.orderColDefs,
            pagination: true,
            paginationPageSize: 5,
            paginationPageSizeSelector: [5, 10, 50, 100],
            paginateChildRows: true,
            animateRows: false,
            defaultColDef: {
                filter: true,
                flex: 1,
                minWidth: 10
            }
        };
        this.store = useStore();
    },
    components: {
        AgGridVue // Add Vue Data Grid component
    },
    methods: {
        onGridReady(params) {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        },
        select_change(event) {
            this.chck_sttus = event.target.value;
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
            let now = new Date();
            now.setDate(now.getDate() + this.fx_code_list.chck_cycle);
            this.next_date = useDateUtils.dateFormat(now, "yyyy-MM-dd");
            this.not_check = this.fx_code_list.not_chck_resn;
            this.getChckIem();
            this.fx_code_list.charger = this.store.state.empInfo[this.store.state.empInfo.length - 1].name;
        },
        async chck_fx_insert() {
            let input = [
                '점검 완료',
                this.fx_code_list.charger,
                this.fx_code_list.chck_time,
                this.chck_sttus,
                parseInt(this.$route.params.fx_code)
            ];
            let result = await axios.put(`${ajaxUrl}/equip/not_check_update`, input)
                .catch(err => console.log(err));
            let now = new Date();
            now = useDateUtils.dateFormat(now, "yyyy-MM-dd");
            let list = [
                this.fx_code_list.eqp_code,
                this.fx_code_list.chck_nm,
                this.fx_code_list.chck_knd,
                this.fx_code_list.charger,
                this.fx_code_list.chck_time,
                now
            ]
            let result_2 = await axios.post(`${ajaxUrl}/equip/chck_fc_insert`, list)
                .catch(err => console.log(err));


            let insert_arr = [];
            for (let i = 0; i < this.rowData.length; i++) {
                let chck_result_insert = [
                    parseInt(this.fx_code),
                    this.rowData[i].iem_nm,
                    parseInt(this.rowData[i].mesure_value),
                    this.rowData[i].stblt_at,
                ];
                insert_arr.push(chck_result_insert);
            }

            let result_3 = await axios.post(`${ajaxUrl}/equip/chck_result_insert`, insert_arr)
                .catch(err => console.log(err));
            this.$router.push({ name: 'checkSchdul' });
        },
        async not_check_btn() {
            let input = [
                this.not_check,
                this.fx_code_list.charger,
                this.fx_code_list.chck_time,
                '미점검',
                parseInt(this.$route.params.fx_code)
            ];
            let result = await axios.put(`${ajaxUrl}/equip/not_check_update`, input)
                .catch(err => console.log(err));

            let list = [
                this.fx_code_list.eqp_code,
                this.fx_code_list.chck_nm,
                this.fx_code_list.chck_knd,
                this.fx_code_list.charger,
                this.fx_code_list.chck_time,
                this.fx_code_list.last_bgnde
            ]

            let result_2 = await axios.post(`${ajaxUrl}/equip/chck_fc_insert`, list)
                .catch(err => console.log(err));

            this.$router.push({ name: 'checkSchdul' });
        },
        async getChckIem() {
            let result = await axios.get(`${ajaxUrl}/equip/chck_iem_list/${this.fx_code_list.model_nm}`)
                .catch(err => console.log(err));
            if (result.data.length == 0) {
                this.rowData = [
                    {
                        index: '1',
                        iem_nm: '-',
                        mesure_value: '-',
                        stblt_at: '-'
                    }
                ]
            } else {
                for (let i = 0; i < result.data.length; i++) {
                    let new_sample = {
                        index: i + 1,
                        iem_nm: result.data[i].iem_nm,
                        mesure_value: '-',
                        stblt_at: '-'
                    }
                    this.rowData = [...this.rowData, new_sample];
                }
                this.index = result.data.length + 1;
            }
        },
        async not_opr_btn() {
            let list = [
                this.fx_code_list.eqp_code,
                this.fx_code_list.charger,
                this.not_check,
                'OD01'
            ];
            let result = await axios.post(`${ajaxUrl}/equip/not_opr_insert`, list)
                .catch(err => console.log(err));

            let input = [
                this.not_check,
                this.fx_code_list.charger,
                this.fx_code_list.chck_time,
                '미가동',
                parseInt(this.$route.params.fx_code)
            ];
            let result_2 = await axios.put(`${ajaxUrl}/equip/not_check_update`, input)
                .catch(err => console.log(err));
        }
    }
}
</script>