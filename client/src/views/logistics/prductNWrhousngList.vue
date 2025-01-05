<template>
<v-row>
    <v-col cols="12">
        <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 5px;">
            <template v-slot:title>
                        <span class="font-weight-black">반제품 입고 관리</span>
            </template>
        </v-card>
        <button class="btn btn-primary mx-2" @click="prductNReturnListisModified">반환제품리스트</button>
        <button class="btn btn-primary mx-2" @click="prductNListisModified">일반제품리스트</button>
    </v-col>
    <v-col cols="12" v-if="isModified">
        <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
                <span class="font-weight-black">반환반제품리스트</span>
            </template>
            <v-card-text  class="bg-surface-light pt-4">
                <AgGridVue
                    style="height: 500px; margin: 0 auto;"
                    @grid-ready="onGridReady"
                    :rowData="rowData"
                    :columnDefs="colDefs"
                    :rowSelection="rowSelection"
                    @cellClicked="onCellClickedreturn"
                    :gridOptions="gridOptionsReturn"
                    class="ag-theme-alpine"
                    id="grid-one">
                </AgGridVue>
            </v-card-text>
        </v-card>
    </v-col>

        <!-- BOM 상세조회 -->
        <v-col cols="12" v-if="isModified2">
            <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
                <span class="font-weight-black">일반반제품</span>
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
import { useToast } from "primevue";

export default {
data() {
    return {
        isModified: true,
        isModified2: false,
        prductNReturnList: [],    // 반환반제품
        rowData: '',
        colDefs: '',

        prductNList: [],    // 일반반제품
        rowDataSelect: '',
        colDefsSelect: '',
        toast: useToast()
    };
},
created() {
    this.getprductNReturnList();
    this.colDefs = ([
        { field: "prduct_n_name", headerName:"제품명" },         // 반제품 반환 리스트로 변경해야됨
        { field: "prduct_n_code", headerName:"제품코드" },    // 반제품 반환 리스트로 변경해야됨
        { field: "nusgqty", headerName:"재입고량" },    // 반제품 반환 리스트로 변경해야됨
        { field: "requst_date", headerName:"출고날짜",
            valueFormatter: (params) => { return userDateUtils.dateFormat(params.value, 'yyyy-MM-dd'); }
        },
        //{ field: "입고", headerName:"입고", cellRenderer: () => {return "입고"}}
        { field: "입고", headerName: "입고",  cellStyle: { textAlign: "center" } ,cellRenderer: () => {
                                            return '<button class="btn btn-primary mx-2">입고</button>';
        }}
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
    this.getprductNList();
    this.colDefsSelect = ([
        { field: "prd_nm", headerName:"제품명" },
        { field: "prd_code", headerName:"제품코드" },
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

    async onCellClickedreturn(event) {
        if(event.colDef.field !== "입고"){
            return;
        }
        this.select_code = event.data.prduct_n_code;
        
        let obj = [
            event.data.prduct_n_code,
            event.data.prduct_n_name,
            event.data.prdctn_code,
            event.data.nusgqty,
            event.data.nusgqty
        ]
        let result = await axios.post(`${ajaxUrl}/prduct_n_wrhousngReturn`, obj)
                                .catch(err => console.log(err));
        if(result){
            let result2 = await axios.put(`${ajaxUrl}/prduct_n_dlivyReturn/${event.data.prduct_n_dlivy_no}`)
                                        .catch(err => console.log(err));
            if(result2){
                this.toast.add({ severity: 'success', summary: '성공', detail: '입고가 완료되었습니다.', life: 3000 });
            }
            let result = await axios.get(`${ajaxUrl}/prdctn_n_return_list`)
                                        .catch(err => console.log(err));
                        this.prductNReturnList = result.data;
                        console.log(this.prductNReturnList);
                        this.rowData = this.prductNReturnList;
        }

    },

    async onCellClicked(event) {
        // '입고' 열이 아닌 경우 클릭 무시
        if (event.colDef.field !== "입고") {
            return;
        }

        // '입고' 열 클릭 동작
        this.selectedPrd_code = event.data.prd_code;
        this.getprductNList(this.selectedPrd_code); 

        let obj = [
            event.data.prd_nm, 
            event.data.prd_code,
            event.data.prdctn_code,
            event.data.nrmlt,
            event.data.nrmlt
        ]
        console.log('obj',obj);

        let result = await axios.post(`${ajaxUrl}/prduct_n_wrhousng`, obj)
                        .catch(err => console.log(err));
        let result2 = await axios.get(`${ajaxUrl}/prdctn_n_list`)
                .catch(err => console.log(err));
            this.prductNList = result2.data;
            this.rowDataSelect = this.prductNList;

    },
    // 반제품 반환제품 리스트로 select 변경해야됨
    async getprductNReturnList() {
        let result = await axios.get(`${ajaxUrl}/prdctn_n_return_list`)
            .catch(err => console.log(err));
        this.prductNReturnList = result.data;
        console.log(this.prductNReturnList);
        this.rowData = this.prductNReturnList;
    },
    async getprductNList() {
        let result = await axios.get(`${ajaxUrl}/prdctn_n_list`)
            .catch(err => console.log(err));
        this.prductNList = result.data;
        this.rowDataSelect = this.prductNList;
    },
    //날짜 yyyy-MM-dd형식에 맞춰서 가져오기
    customDateFormat(params) {
            return userDateUtils.dateFormat(params.value, 'yyyy-MM-dd');  // 날짜 데이터 전체 포맷
    },
    // 반환 리스트 출력
    prductNReturnListisModified(){
        this.isModified = true;
        this.isModified2 = false;
    },

    // 일반 리스트 출력
    prductNListisModified(){
        this.isModified2 = true;
        this.isModified = false;
    }

}
};
</script>