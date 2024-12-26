<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th style="width: 80%; font-size: 30px;">
                    점검 일자 조회
                </th>
                <th style="width: 10%;">
                    <button type="button" class="btn btn-primary" style="color: white;" @click="now_btn()">현재
                    </button>
                </th>
                <th style="width: 10%;">
                    <button type="button" class="btn btn-primary" style="color: white;" @click="all_btn()">전체
                    </button>
                </th>
            </tr>
        </thead>
    </table>
    <div style="width: 50%; display: inline-block;">
        <v-row>
            <v-col>
                <v-sheet height="525">
                    <v-calendar color="primary" :events="events"></v-calendar>
                </v-sheet>
            </v-col>
        </v-row>
    </div>
    <div style="width: 50%; display: inline-block;">
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 525px"
            @grid-ready="onGridReady" class="ag-theme-alpine">
        </ag-grid-vue>
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
            eqpList: [],
            rowData: [],
            colDefs: [],
            events: []
        };
    },
    created() {
        this.getCheckList();
        this.colDefs = [
            { field: "fx_code", headerName: "일정코드", hide: true, suppressToolPanel: true },
            { field: "eqp_code", headerName: "설비코드" },
            { field: "chck_nm", headerName: "점검명" },
            { field: "chck_knd", headerName: "점검종류" },
            { field: "chck_exp", headerName: "점검예정일" },
            { field: "chck_time", headerName: "점검시간" }
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
            onCellClicked: (CellClickedEvent) => this.goToDetail(CellClickedEvent.data.fx_code)
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
        async getCheckList() {
            this.colDefs = [
                { field: "fx_code", headerName: "일정코드", hide: true, suppressToolPanel: true },
                { field: "eqp_code", headerName: "설비코드" },
                { field: "chck_nm", headerName: "점검명" },
                { field: "chck_knd", headerName: "점검종류" },
                { field: "chck_exp", headerName: "점검예정일" },
                { field: "chck_time", headerName: "점검시간" }
            ]
            this.rowData = [];
            let result = await axios.get(`${ajaxUrl}/equip/chck_fx_list`)
                .catch(err => console.log(err));
            this.checkList = result.data;
            for (let i = 0; i < this.checkList.length; i++) {
                let now = new Date(this.checkList[i].last_bgnde);
                now.setDate(now.getDate() + this.checkList[i].chck_cycle);
                this.checkList[i].chck_exp = now;
                this.checkList[i].chck_exp = useDateUtils.dateFormat(this.checkList[i].chck_exp, "yyyy-MM-dd")
            }
            this.rowData = this.checkList;
            this.input_events();
        },
        now_btn() {
            this.getCheckList();
        },
        async all_btn() {
            this.colDefs = [
                { field: "fx_code", headerName: "일정코드", hide: true, suppressToolPanel: true },
                { field: "eqp_code", headerName: "설비코드" },
                { field: "chck_nm", headerName: "점검명" },
                { field: "chck_knd", headerName: "점검종류" },
                { field: "last_bgnde", headerName: "마지막 점검일" },
                { field: "chck_time", headerName: "점검시간" }
            ]
            let result = await axios.get(`${ajaxUrl}/equip/chck_fx_all_list`)
                .catch(err => console.log(err));
            this.checkList = result.data;
            for (let i = 0; i < this.checkList.length; i++) {
                this.checkList[i].last_bgnde = useDateUtils.dateFormat(this.checkList[i].last_bgnde, "yyyy-MM-dd")
            }
            this.rowData = this.checkList;
        },
        goToDetail(fx_code) {
            this.$router.push({ name: 'checkfxlist', params: { fx_code: fx_code } });
        },
        input_events() {
            let colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'];
            let all_event = this.rowData;
            this.events = [];
            for (let i = 0; i < all_event.length; i++) {
                this.events.push({
                    title: all_event[i].eqp_code,
                    start: new Date(all_event[i].chck_exp),
                    end: new Date(all_event[i].chck_exp),
                    color: colors[i % colors.length],
                    allDay: 0
                })
            }
            
        }
    }
};
</script>