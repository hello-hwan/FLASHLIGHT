<template>
    <div>
        <v-card class="mx-auto card-custom-1" style="border-radius:13px; text-align: center;">
            <template v-slot:title>
                <span class="font-weight-black">
                    설비 전체 조회
                </span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
                <div>
                    <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 525px"
                        @grid-ready="onGridReady" class="ag-theme-alpine">
                    </ag-grid-vue>
                </div>
                <button type="button" class="btn btn-primary" style="color: white; margin: 10px; padding: 2px; width: 150px;" @click="add_eqp_btn()">기기 추가
                    등록</button>
                <button type="button" class="btn btn-danger" style="color: white; margin: 10px; padding: 2px; width: 150px;" @click="delete_eqp_btn()">등록 기기
                    삭제</button>
                    <div style="margin: 0 auto; height: auto; background-color: lightgray; width: 50%;" v-show="delete_div">
                        <p style="margin: 2px; padding: 2px;">아래에 설비코드를 입력하고 버튼을 누르면 삭제합니다.</p>
                        <input style="background-color: lightsteelblue; margin: 5px;" type="text" v-model="delete_eqp_code" size="9">
                        <button type="button" class="btn btn-primary" style="color: white; margin: 2px; padding: 2px; width: 75px;"
                            @click="delete_cansle_button()">취소</button>
                        <button type="button" class="btn btn-danger" style="color: white; margin: 2px; padding: 2px; width: 75px;"
                            @click="real_delete_btn()">삭제</button>
                    </div>
            </v-card-text>
        </v-card>
    </div>

    <span style="margin-left:20px; margin-bottom:0; margin-top:0;">
        <div class="modal-wrap" @click="modal_close_btn()" v-show="modal_on_off">
            <div >
                    <v-card @click.stop=""class="modal-container mx-auto card-custom-1" style="border-radius:13px; text-align: center; position: relative; top: 400px;left: 40%;">
                        <template v-slot:title>
                            <span class="font-weight-black">
                                설비 추가 등록

                            </span>
                        </template>
                        <v-card-text class="bg-surface-light pt-4">

                            <table class="table table-hover" style="margin-bottom: 0;">
                                <tbody>
                                    <tr>
                                        <th style="width: 25%;">
                                            설비코드
                                        </th>
                                        <th style="width: 25%;">
                                            <input style="background-color:#eeeeee; text-align: center;" type="text"
                                                v-model="eqp_code">
                                        </th>
                                        <th style="width: 25%;">
                                            등록일자
                                        </th>
                                        <th style="width: 25%;">
                                            <input style="background-color:#eeeeee; text-align: center;" type="text"
                                                v-model="regsde">
                                        </th>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <th style="width: 25%;">
                                            설비명
                                        </th>
                                        <th style="width: 25%;">
                                            <input style="background-color:#eeeeee; text-align: center;" type="text"
                                                v-model="eqp_nm">
                                        </th>
                                        <th style="width: 25%;">
                                            모델명
                                        </th>
                                        <th style="width: 25%;">
                                            <input style="background-color:#eeeeee; text-align: center;" type="text"
                                                v-model="model_nm">
                                        </th>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <th style="width: 25%;">
                                            제조업체
                                        </th>
                                        <th style="width: 25%;">
                                            <input style="background-color:#eeeeee; text-align: center;" type="text"
                                                v-model="mfbiz">
                                        </th>
                                        <th style="width: 25%;">
                                            점검주기
                                        </th>
                                        <th style="width: 25%;">
                                            <input style="background-color:#eeeeee; text-align: center;" type="text"
                                                v-model="chck_cycle">
                                        </th>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <th style="width: 25%;">
                                            제조일
                                        </th>
                                        <th style="width: 25%;">
                                            <input style="background-color:#eeeeee; text-align: center;" type="text"
                                                v-model="mnfctur_de">
                                        </th>
                                        <th style="width: 25%;">
                                            크기
                                        </th>
                                        <th style="width: 25%;">
                                            <input style="background-color:#eeeeee; text-align: center;" type="text"
                                                v-model="mg">
                                        </th>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <th style="width: 25%;">
                                            비고
                                        </th>
                                        <th style="width: 25%;">
                                            <input style="background-color:#eeeeee; text-align: center;" type="text"
                                                v-model="rm">
                                        </th>
                                        <th style="width: 25%;">
                                            설비 담당자
                                        </th>
                                        <th style="width: 25%;">
                                            <input style="background-color:#eeeeee; text-align: center;" type="text"
                                                v-model="charger">
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="modal-btn" style="display:flex; justify-content: center;">
                                <button @click="modal_close_btn()" class="btn btn-secondary" style="margin: 5px; padding: 2px; width: 75px;">닫기</button>
                                <button @click="modal_submit_btn()" class="btn btn-primary" style="margin: 5px; padding: 2px; width: 75px;">등록</button>
                            </div>
                        </v-card-text>
                    </v-card>
            </div>
        </div>
    </span>
</template>

<script>
//import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import useDateUtils from '@/utils/useDates.js';

import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';

export default {
    name: 'App',
    data() {
        return {
            eqpAllList: [],
            rowData: [],
            colDefs: [],
            eqp_code: '',
            eqp_nm: '',
            model_nm: '',
            regsde: '',
            mfbiz: '',
            mg: '',
            chck_cycle: 90,
            mnfctur_de: '',
            rm: '',
            charger: '',
            modal_on_off: false,
            delete_div: false,
            delete_eqp_code: '', 
            toast: '', 
            store: ''
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
        let now = new Date();
        this.regsde = useDateUtils.dateFormat(now, "yyyy-MM-dd");
        this.mnfctur_de = useDateUtils.dateFormat(now, "yyyy-MM-dd");
        this.toast = useToast();
        this.store = useStore();
        this.charger = this.store.state.empInfo[this.store.state.empInfo.length-1].name;
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
        async modal_submit_btn() {
            let input = [
                this.eqp_code,
                this.eqp_nm,
                this.model_nm,
                this.regsde,
                this.mfbiz,
                this.mg,
                this.chck_cycle,
                this.mnfctur_de,
                this.rm
            ];
            let result = await axios.post(`${ajaxUrl}/equip/eqp_insert`, input)
                .catch(err => console.log(err));

            let now = new Date();
            now = useDateUtils.dateFormat(now, "yyyy-MM-dd");
            let list = [
                this.eqp_code,
                '정기정검',
                '정기점검',
                this.charger,
                '09:00 ~ 13:00',
                now
            ]
            let result_2 = await axios.post(`${ajaxUrl}/equip/chck_fc_insert`, list)
                .catch(err => console.log(err));
            this.modal_on_off = false;
            this.getEqpList();
        },
        add_eqp_btn() {
            this.modal_on_off = !this.modal_on_off;
            this.delete_div = false;
        },
        modal_close_btn() {
            this.modal_on_off = !this.modal_on_off;
            this.eqp_code = '';
            this.regsde = '';
            this.eqp_nm = '';
            this.model_nm = '';
            this.mfbiz = '';
            this.chck_cycle = '';
            this.mnfctur_de = '';
            this.mg = '';
            this.rm = '';
            this.charger = '';
        },
        delete_eqp_btn() {
            this.delete_div = !this.delete_div;
        },
        delete_cansle_button() {
            this.delete_eqp_code = '';
            this.delete_div = !this.delete_div;
        },
        async real_delete_btn() {
            for (let i = 0; i < this.rowData.length; i++) {
                if (this.rowData[i].eqp_code == this.delete_eqp_code) {
                    let result_1 = await axios.delete(`${ajaxUrl}/equip/eqp_delete/${this.delete_eqp_code}`)
                        .catch(err => console.log(err));
                        break;
                }
                if (i == this.rowData.length - 1) {
                    this.toast.add({ severity: 'error', summary: '삭제 실패', detail: '설비 코드를 찾을 수 없습니다.', life: 3000 });
                    return 
                }
            }
            this.delete_div = false;
            this.delete_eqp_code = '';
            this.getEqpList();
            this.toast.add({ severity: 'success', summary: '삭제 성공', detail: '정상적으로 삭제했습니다.', life: 3000 });
        }
    }
};
</script>
