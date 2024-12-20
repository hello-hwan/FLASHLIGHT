<template>
    <div class="businessOrderListTitle">
        주문 상세
    </div>
    <div class="container">
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label" >업체코드</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.p_code" diabled>
            </div>
            <div class="col-auto">
                <span class="form-text">
                PRD-00
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">주문일자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.order_date" placeholder="2024-12-28">
            </div>
            <div class="col-auto">
                <span class="form-text">
                2024-00-00
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">납품일자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.dete" placeholder="2025-08-17">
            </div>
            <div class="col-auto">
                <span class="form-text">
                2024-00-00
                </span>
            </div>
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">주문번호</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="this.requst.order_no" placeholder="ORDER-01">
            </div>
            <div class="col-auto">
                <span class="form-text">
                ORDER-00
                </span>
            </div>
        </div>
        <div>
            <!-- <button type="button" class="btn btn-secondary" @click="getAllRows()">저장</button> -->
            <button type="button" class="btn btn-secondary" @click="orderReplace()">주문수정</button>
            <button type="button" class="btn btn-secondary" @click="onInsertInit()">초기화</button>
            <button type="button" class="btn btn-secondary orderRowInsert" @click="onRemoveSelected()">행삭제</button>
            <button type="button" class="btn btn-secondary orderRowInsert" @click="onAddRow()">행추가</button>
        </div>
    </div>
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 500px" class="ag-theme-alpine" :gridOptions="gridOptionsOrder"
        @grid-ready="onGridReady">
        </ag-grid-vue>
    </div>
    </template>
    
    <script>
    import { ref } from 'vue';
    import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
    import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
    import userDateUtils from '@/utils/useDates.js';
    ModuleRegistry.registerModules([AllCommunityModule]);
    
    import axios from 'axios';
    import { ajaxUrl } from '@/utils/commons.js';
    
    export default { 
        data() { 
            return { 
                orderInfoList:[], 
                rowData: ref([]), 
                cosDefs:'',
                requst:{} 
            }; 
        }, 
        created() { 
            let selectNo = this.$route.params.order_no;
            this.getorderInfoList();
            this.colsDefs = ref([ 
                {field: "order_list_no", headerName:"주문목록번호", editable:true }, 
                {field: "prd_code", headerName:"품목코드", editable:true }, 
                {field: "untpc", headerName:"주문단가", editable:true }, 
                {field: "order_qy", headerName:"주문수량", editable:true }, 
                {field: "wrter", headerName:"작성자", editable:true } 
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
        },
        methods: { 
            onGridReady(params) { 
                this.gridApi = params.api; 
                this.columnApi = params.columnApi; 
            }, 
            async getorderInfoList(){
                console.log(`상세조회 시작`);
                let result = await axios.get(`${ajaxUrl}/business/orderList/${this.selectNo}`)
                                            .catch(err=>console.log(err));
                console.log(`상세조회 완료`, result);
                this.orderInfoList = result.data;
                this.rowData = ref(this.orderInfoList);
            },/*
            async orderListReplace() { 
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
            }, */
            onAddRow(){ 
                let newData = { 
                    order_list_no: "ORDER-00-0", 
                    prd_code:"PRD-01", 
                    untpc: 0, 
                    order_qy: 0, 
                    wrter:"김기환" 
                }; 
                this.rowData = [...this.rowData, newData]; 
                console.log(this.rowData); 
            }, 
            onRemoveSelected(){ 
                this.rowData.pop(); 
                this.rowData = [...this.rowData]; 
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
            customDateFormat1(params){ 
                return userDateUtils.dateFormat(params.data.order_date,'yyyy-MM-dd'); 
            }, 
            customDateFormat2(params){ 
                return userDateUtils.dateFormat(params.data.dete,'yyyy-MM-dd'); 
            } 
        } 
    }
    </script>
    
    <style lang="scss">
        .businessOrderListTitle{
            background-color: darkgrey;
            font-size:20px;
            text-align : center;
            width : 20%;
            height : 60px;
            line-height:60px;
            margin:5px;
        }
    </style>