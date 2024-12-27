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
    </div>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 70%; font-size: 30px;">
                        설비 추가 등록
                    </th>
                </tr>
            </thead>
        </table>
        <table class="table table-hover">
            <tbody>
                <tr>
                    <th style="width: 25%;">
                        설비코드
                    </th>
                    <th style="width: 25%;">
                        <input style="background-color:lightsteelblue; text-align: center;" type="text"
                            v-model="eqp_code">
                    </th>
                    <th style="width: 25%;">
                        등록일자
                    </th>
                    <th style="width: 25%;">
                        <input style="background-color:lightsteelblue; text-align: center;" type="text"
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
                        <input style="background-color:lightsteelblue; text-align: center;" type="text"
                            v-model="eqp_nm">
                    </th>
                    <th style="width: 25%;">
                        모델명
                    </th>
                    <th style="width: 25%;">
                        <input style="background-color:lightsteelblue; text-align: center;" type="text"
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
                        <input style="background-color:lightsteelblue; text-align: center;" type="text" v-model="mfbiz">
                    </th>
                    <th style="width: 25%;">
                        점검주기
                    </th>
                    <th style="width: 25%;">
                        <input style="background-color:lightsteelblue; text-align: center;" type="text"
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
                        <input style="background-color:lightsteelblue; text-align: center;" type="text"
                            v-model="mnfctur_de">
                    </th>
                    <th style="width: 25%;">
                        크기
                    </th>
                    <th style="width: 25%;">
                        <input style="background-color:lightsteelblue; text-align: center;" type="text" v-model="mg">
                    </th>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <th style="width: 25%;">
                        비고
                    </th>
                    <th style="width: 25%;">
                        <input style="background-color:lightsteelblue; text-align: center;" type="text" v-model="rm">
                    </th>
                    <th style="width: 25%;">
                        설비 담당자
                    </th>
                    <th style="width: 25%;">
                        <input style="background-color:lightsteelblue; text-align: center;" type="text"
                            v-model="charger">
                    </th>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <th style="width: 25%;">
                    </th>
                    <th style="width: 25%;">
                    </th>
                    <th style="width: 25%;">
                    </th>
                    <th style="width: 25%;">
                        <button type="button" class="btn btn-success" style="color: white;"
                            @click="eqp_insert()">등록</button>
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
            eqp_code: '',
            eqp_nm: '',
            model_nm: '',
            regsde: '',
            mfbiz: '',
            mg: '',
            chck_cycle: '',
            mnfctur_de: '',
            rm: '',
            charger: ''
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
        async eqp_insert() {
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
        }
    }
};
</script>
