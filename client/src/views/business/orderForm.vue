<template>
    <v-card class="mx-auto card-custom-1" style="border-radius:13px;">
        <template v-slot:title>
            <span class="font-weight-black">
                주문 요청
            </span>
        </template>
    </v-card>

    <v-container fluid style="position:relative; z-index: 1;">
        <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <v-card-text class="bg-surface-light pt-4">
                <div class="row g-3 align-items-center">
                    <div class="col-2">
                        <label for="orderFormMtltyCode" class="col-form-label" >업체코드</label>
                    </div>
                    <div class="col-auto">
                        <bfSearchCompanyModal @companySelectedData="getBFCompanyInfo"  />
                    </div>
                </div>
                <div class="row g-3 align-items-center">
                    <div class="col-2">
                        <label for="orderFormOrderDate" class="col-form-label">주문일자</label>
                    </div>
                    <div class="col-auto">
                        <input type="text" id="orderFormOrderDate" class="form-control" v-model="this.requst.order_date" placeholder="2024-12-28">
                    </div>
                    <div class="col-auto">
                        <span class="form-text">
                        2024-00-00
                        </span>
                    </div>
                </div>
                <div class="row g-3 align-items-center">
                    <div class="col-2">
                        <label for="orderFormDete" class="col-form-label">납품일자</label>
                    </div>
                    <div class="col-auto">
                        <input type="text" id="orderFormDete" class="form-control" v-model="this.requst.dete" placeholder="2025-08-17">
                    </div>
                    <div class="col-auto">
                        <span class="form-text">
                        2024-00-00
                        </span>
                    </div>
                </div>
                <div class="row g-3 align-items-center">
                    <div class="col-2">
                        <label for="orderFormOrderNo" class="col-form-label">주문번호</label>
                    </div>
                    <div class="col-auto">
                        <input type="text" id="orderFormOrderNo" class="form-control" v-model="this.requst.order_no" placeholder="ORDER-01">
                    </div>
                    <div class="col-auto">
                        <span class="form-text">
                        ORDER-00
                        </span>
                    </div>
                </div>
                <div style="margin-top:10px;">
                    <button type="button" class="btn btn-success" @click="orderInsert()" style="color:white;">주문등록</button>
                    <button type="button" class="btn btn-warning" @click="onInsertInit()" >초기화</button>
                    <button type="button" class="btn btn-danger orderRowInsert" @click="deleteBtn()" style="color:white;">선택행삭제</button>
                    <button type="button" class="btn btn-success orderRowInsert" @click="onAddRow()" style="color:white;">행추가</button>
                </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
    <v-card-text class="bg-surface-light pt-4" style="position: relative; z-index:0;">
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 519px; position:relative; z-index:0;" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
        @grid-ready="onGridReady" rowSelection="multiple" >
        </ag-grid-vue>
    </div>
    </v-card-text>
</template>

<script>
import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import userDateUtils from '@/utils/useDates.js';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

import bfSearchCompanyModal from '@/components/business/businessSearchCompanyModal.vue';

export default {
    data() { 
        return { 
            orderList: [], 
            rowData: ref([]), 
            colDefs: '', 
            requst:{}, 
            companyCode: ''
        }; 
    }, 
    created() { 
        this.onAddRow(); 
        this.colDefs = ref([ 
            { field: "order_list_no", headerName:"주문목록번호", editable: true, checkboxSelection:true }, 
            { field: "prd_code", headerName:"품목코드", editable: true }, 
            { field: "untpc", headerName:"주문단가", editable: true }, 
            { field: "order_qy", headerName:"주문수량", editable: true }, 
            { field: "wrter", headerName:"작성자", editable: true } 
        ]);
        this.gridOptionsOrder = { 
                columnDefs: this.returnColDefs, 
                pagination: true, 
                paginationPageSize: 10, 
                paginationPageSizeSelector: [10, 20, 50, 100], 
                paginateChildRows: true, 
                animateRows: false, 
                filter: 'agTextColumnFilter', 
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
        bfSearchCompanyModal
    }, 
    methods: { 
        onGridReady(params) { 
            this.gridApi = params.api; 
            this.columnApi = params.columnApi; 
        }, 
        async orderInsert() { 
            for(let i=0; i < this.gridApi.getRenderedNodes().length; i++){ 
                let orderRegister = { ...this.requst,...this.gridApi.getRenderedNodes()[i].data };
                console.log("합친결과는"); 
                console.log(orderRegister); 
                let result = await axios.post(`${ajaxUrl}/business/orderForm`,orderRegister)
                                             .catch(err=>console.log(err)); 
                console.log("결과는"); 
                console.log(result); 
                let addRes = result.data; 
                if(addRes.result){ 
                    alert(`등록되었습니다.`); 
                } 
            } 
        }, 
        customDateFormat1(params){
            return userDateUtils.dateFormat(params.data.order_date,'yyyy-MM-dd');
        },
        customDateFormat2(params){
            return userDateUtils.dateFormat(params.data.dete,'yyyy-MM-dd');
        },/*
        getAllRows() {
            console.log("DOM 객체");
            console.log(this.gridApi.getRenderedNodes()); // 배열, [0].data.prd_code로 가져옴
            console.log("0번 데이터");
            console.log(this.gridApi.getRenderedNodes()[0].data);
            //console.log("0번데이터 공급가액"+this.gridApi.getRenderedNodes()[0].data.splpc);
            console.log("DOM 객체 길이"+this.gridApi.getRenderedNodes().length);
            for ( let i = 0; i < this.gridApi.getRenderedNodes().length; i++){
                this.rowData[i] = this.gridApi.getRenderedNodes()[i].data;
                console.log(this.rowData[i]);
            }
        },*/
        onAddRow(){
            let newData = {
                order_list_no: "ORDER-00-0",
                prd_code:"PRD-01", 
                untpc: 0, 
                order_qy: 0,
                wrter:"김기환"
            };
            this.rowData = [...this.rowData, newData];
            // this.rowData.push(newData);
            console.log(this.rowData);
        },
        deleteBtn(){
            // 그리드api - 선택된 node들을 배열로 들고오는 함수
            const selectedNodes = this.gridApi.selectedNodes();
            console.log(selectedNodes);
            // 선택된 행들의 숫자만큼 반복, 신규 배열 생성
            for(let i = 0 ; i < selelctedNodes.length; i++){
                let result_arr=[];
                console.log(selectedNodes[i].data.order_list_no);
                // 현재 입력된 rowData 배열의 총 갯수만큼 반복, 
                for(let j = 0; j < this.rowData.length; j++){
                    // rowData와 주문목록번호를 비교해서 같은것이 있으면 생략하고 배열 생성
                    // 하나가 생략된 배열이 새로 생성 -> this.rowData에 새로운 배열 등록
                    if ( this.rowData[j].order_list_no == selected[i].data.order_list_no){
                        continue;
                    }
                    result_arr = [...result_arr,this.rowData[j]];
                }
                this.rowData=result_arr;
            }
        },
        onInsertInit(){
            this.requst = {
                p_code : "BCNC-01", 
                order_date :"2024-12-28", 
                dete : "2025-08-17", 
                order_no : "ORDER-00"
            },
            this.rowData = [{
                order_list_no: "ORDER-00-0",
                prd_code:"PRD-01", 
                untpc: 0, 
                order_qy: 0,
                wrter:"김기환"
            }]; 
        },
        getBFCompanyInfo(info){
            this.requst.p_code = info[0].bcnc_code;
        }
    }
};
</script>

<style lang="scss">
.orderRowInsert{
     float: right;
}


</style>