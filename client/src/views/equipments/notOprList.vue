<template>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 70%; font-size: 30px;">
                        미가동 설비 조회
                    </th>
                </tr>
            </thead>
        </table>
        <div>
            <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 500px"
                @grid-ready="onGridReady" class="ag-theme-alpine">
            </ag-grid-vue>
        </div>
        <div>
            <table class="table table-hover">
                <tbody>
                    <tr>
                        <th>
                            특이사항 : 
                            <input style="background-color:lightsteelblue;" type="text" size="30" v-model="not_opr">
                            <button type="button" class="btn btn-primary" style="color: white;" @click="submit_btn()">미가동 해제</button>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
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
    name: 'App',
    data() {
        return {
            notOprList: [],
            rowData: [],
            colDefs: [],
            not_opr: ''
        };
    },
    created() {
        this.getNotEqpList();
        this.colDefs = [
            { field: "not_opr_code", headerName: "미가동코드", hide: true, suppressToolPanel: true },
            { field: "eqp_code", headerName: "설비코드", checkboxSelection: true },
            { field: "stop_time", headerName: "가동정지일" },
            { field: "eqp_charger", headerName: "담당자", editable: true },
            { field: "not_opr_resn", headerName: "미가동 사유" }
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
    },
    components: {
        AgGridVue // Add Vue Data Grid component
    },
    methods: {
        onGridReady(params) {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        },
        async getNotEqpList() {
            let result = await axios.get(`${ajaxUrl}/equip/not_opr_list`)
                .catch(err => console.log(err));
            this.notOprList = result.data;
            for (let i = 0; i < this.notOprList.length; i++) {
                this.notOprList[i].stop_time = useDateUtils.dateFormat(this.notOprList[i].stop_time, "yyyy-MM-dd")
            }
            this.rowData = this.notOprList;
        }, 
        async submit_btn() {
            const selectedNodes = this.gridApi.getSelectedNodes();
            let list = [
                this.not_opr, 
                selectedNodes[0].data.not_opr_code
            ];
            let result = await axios.put(`${ajaxUrl}/equip/not_opr_update`, list)
                .catch(err => console.log(err));

            let now = new Date();
            now = useDateUtils.dateFormat(now, "yyyy-MM-dd");
            let index = [
                selectedNodes[0].data.eqp_code,
                '정기점검',
                '정기점검',
                selectedNodes[0].data.eqp_charger,
                '09:00 ~ 13:00',
                now
            ];
            console.log(index);
            let result_2 = await axios.post(`${ajaxUrl}/equip/chck_fc_insert`, index)
                .catch(err => console.log(err));

            this.getNotEqpList();
            this.not_opr = '';
        }
    }
};
</script>
