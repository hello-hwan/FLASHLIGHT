<template>
<v-row>
    <v-col cols="12">
        <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 5px;">
            <template v-slot:title>
                        <span class="font-weight-black">완제품 입고 관리</span>
            </template>
        </v-card>
    </v-col>

        <!-- BOM 상세조회 -->
        <v-col cols="12">
            <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
                <span class="font-weight-black">완제품</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
                <AgGridVue style="height: 500px; margin: 0 auto;"
                @grid-ready="onGridReady"
                :rowData="rowDataSelect"
                :columnDefs="colDefsSelect"
                @cellClicked="onCellClicked"
                :rowSelection="rowSelection"
                :gridOptions="gridOptionsReturn"
                overlayNoRowsTemplate="결과없음"
                class="ag-theme-alpine"
                id="grid-info">
                </AgGridVue>
            </v-card-text>
            </v-card>
        </v-col>
        </v-row>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import userDateUtils from '@/utils/useDates.js';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import { useToast } from "primevue";


export default {
data() {
    return {

        prductList: [],    // 일반반제품
        rowDataSelect: '',
        colDefsSelect: '',
        toast: useToast()
    };
},
created() {
    
    this.getprductList();
    this.colDefsSelect = ([
        { field: "prd_code", headerName:"완제품명" },
        { field: "prd_nm", headerName:"완제품코드" },
        { field: "nrmlt", headerName:"생산수량" },
        { field: "end_time", headerName:"생산완료일",
            valueFormatter: this.customDateFormat },
        { field: "입고", headerName: "입고",  cellStyle: { textAlign: "center" } ,cellRenderer: () => {
                                            return '<button class="btn btn-primary mx-2">입고</button>'}}
    ])
    this.gridOptionsReturn = {
                columnDefs: this.returnColDefs,
                pagination: true,
                paginationPageSize: 10,
                paginationPageSizeSelector: [10, 20, 50, 100],
                paginateChildRows: true,
                animateRows: false,
                defaultColDef: {
                    //filter: true,
                    flex: 1,
                    minWidth: 10,
                    resizable: false,
                }
            };
}, 
name: "App",
components: {
    AgGridVue, // Add Vue Data Grid component
},
methods: {
async onCellClicked(event) {
    // '입고' 열이 아닌 경우 클릭 무시
    if (event.colDef.field !== "입고") {
        return;
    }

    // '입고' 열 클릭 동작
    this.selectedPrd_code = event.data.prd_code;
    this.getprductList(this.selectedPrd_code); 

    let obj = [
        event.data.prd_nm, 
        event.data.prd_code,
        event.data.prdctn_code,
        event.data.nrmlt,
        event.data.nrmlt
    ]

    let result = await axios.post(`${ajaxUrl}/prductWrhousng`, obj)
                    .catch(err => console.log(err));
        this.toast.add({ severity: 'success', summary: '성공', detail: '입고가 완료되었습니다.', life: 3000 });
    let result2 = await axios.get(`${ajaxUrl}/prductList`)
            .catch(err => console.log(err));
        this.prductList = result2.data;
        this.rowDataSelect = this.prductList;

},
    async getprductList() {
        let result = await axios.get(`${ajaxUrl}/prductList`)
                                .catch(err => console.log(err));
        this.prductList = result.data;
        this.rowDataSelect = this.prductList;
    },
    //날짜 yyyy-MM-dd형식에 맞춰서 가져오기
    customDateFormat(params) {
            return userDateUtils.dateFormat(params.data.test_date, 'yyyy-MM-dd');  // test_date는 알레아스 이름
    },
    moder(){
        this.moder();
    }

}
};
</script>