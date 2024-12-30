<template>
<v-row>
    <v-col cols="12">
        <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 5px;">
            <template v-slot:title>
                        <span class="font-weight-black">완제품 입고 관리</span>
            </template>
        </v-card>
    </v-col>
    <v-col cols="6">
        <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
                <span class="font-weight-black">반환 제품 리스트</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
                <AgGridVue
                    style="height: 500px; margin: 0 auto;"
                    @grid-ready="onGridReady"
                    :rowData="filteredRowData"
                    :columnDefs="colDefs"
                    :rowSelection="rowSelection"
                    @cellClicked="onCellClicked"
                    :gridOptions="gridOptionsReturn"
                    class="ag-theme-alpine"
                    id="grid-one">
                </AgGridVue>
            </v-card-text>
        </v-card>
    </v-col>

        <!-- BOM 상세조회 -->
        <v-col cols="6">
            <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
                <span class="font-weight-black">일반 완제품</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
                <AgGridVue style="height: 500px; margin: 0 auto;"
                @grid-ready="onGridReady"
                :rowData="rowDataSelect"
                :columnDefs="colDefsSelect"
                @cellClicked="onCellClicked"
                :rowSelection="rowSelection"
                :gridOptions="gridOptionsReturn"
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


export default {
data() {
    return {
        prductReturnList: [],    // 반환반제품
        rowData: '',
        colDefs: '',

        prductList: [],    // 일반반제품
        rowDataSelect: '',
        colDefsSelect: '',
    };
},
created() {
    this.getprductReturnList();
    this.colDefs = ([
        { field: "bom_code", headerName:"제품명" },         // 반제품 반환 리스트로 변경해야됨
        { field: "prdlst_code", headerName:"제품코드" },    // 반제품 반환 리스트로 변경해야됨
        { field: "prdist_name", headerName:"재입고량" },    // 반제품 반환 리스트로 변경해야됨
        { field: "prdctn_qy", headerName:"재입고날짜" },    // 반제품 반환 리스트로 변경해야됨
        { field: "입고", headerName:"입고", cellRenderer: () => {return "입고"}}
    ])
    this.gridOptionsReturn = {
        columnDefs: this.returnColDefs,
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
    this.getprductList();
    this.colDefsSelect = ([
        { field: "prd_code", headerName:"제품명" },
        { field: "mtril_name", headerName:"제품코드" },
        { field: "pass_amount", headerName:"검사합격수량" },
        { field: "test_date", headerName:"검사완료일",
            valueFormatter: this.customDateFormat },
        { field: "입고", headerName: "입고", cellRenderer: () => {return "입고"}}
    ])
    this.gridOptionsReturn = {
                columnDefs: this.returnColDefs,
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
        event.data.mtril_name, 
        event.data.prd_code,
        event.data.mtril_check_code,
        event.data.pass_amount,
        event.data.pass_amount
    ]
    console.log('obj',obj);

    let result = await axios.post(`${ajaxUrl}/prductWrhousng`, obj)
                    .catch(err => console.log(err));
    let result2 = await axios.get(`${ajaxUrl}/prductList`)
            .catch(err => console.log(err));
        this.prductList = result2.data;
        this.rowDataSelect = this.prductList;

},
    // 반제품 반환제품 리스트로 select 변경해야됨
    async getprductReturnList() {
        let result = await axios.get(`${ajaxUrl}/bom`)
            .catch(err => console.log(err));
        this.prductReturnList = result.data;
        this.rowData = this.prductReturnList;
    },
    async getprductList() {
        let result = await axios.get(`${ajaxUrl}/prductList`)
            .catch(err => console.log(err));
            console.log('페이지',result.data);
        this.prductList = result.data;
        console.log(this.prductList);
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