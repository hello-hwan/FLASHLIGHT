<template>
    <!--반환 자재 리스트-->
    <div>
        <AgGridVue style="width: 1400px; height: 500px;"
            @grid-ready="onGridReady"
            :defaultColDef="defaultColDef"
            :rowData="returnRowData"
            :gridOptions="gridOptionsReturn"
            class="ag-theme-alpine"
            id="grid-one">
        </AgGridVue>
    </div>

    <!--주문 자재 리스트-->
    <div style="margin-top: 30px">
        <AgGridVue style="width: 1400px; height: 500px;"
            @grid-ready="onGridReady"
            :defaultColDef="defaultColDef"
            :rowData="orderRowData"
            :gridOptions="gridOptionsOrder"
            class="ag-theme-alpine"
            id="grid-two">
        </AgGridVue>
    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';
import CustomButtonComponent from "@/components/materials/wrhousingButtonComponent.vue";

export default {
    data() {
        return {
            returnList: [], 
            returnRowData: [],    
            returnColDefs: [],
            orderList: [], 
            orderRowData: [],    
            orderColDefs: [],
        };
    },
    created() {
        //반환 입고 리스트
        console.log('리턴 컴포넌트');
        this.getReturnList();
        this.returnColDefs = [
        { field: "lot", hide: true, suppressToolPanel: true}, //hide: true, suppressToolPanel: true --> 행 숨김
        { field: "name", headerName:"자재명" },
        { field: "code", headerName:"자재코드" },
        { field: "qy", headerName:"반환량" },
        { field: "unit", headerName:"단위" },
        { field: "wrdate", headerName:"입고일",
            valueFormatter: this.customDateFormat, //valueFormatter에서 함수를 설정하고 설정한 함수에서 값을 리턴함.  
        },
        { field: "actions", headerName: "선택", cellRenderer: CustomButtonComponent },  //버튼 컴포넌트 설정
        ];
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

        //주문 입고 리스트
        this.getReturnList();
        this.getOrderList();

        this.orderColDefs = [
        { field: "checkCode", headerName: "검사코드", },
        { field: "name", headerName:"자재명" },
        { field: "code", headerName:"자재코드" },
        { field: "qy", headerName:"반환량" },
        { field: "unit", headerName:"단위" },
        { field: "wrdate", headerName:"입고일",
            valueFormatter: this.customDateFormat, //valueFormatter에서 함수를 설정하고 설정한 함수에서 값을 리턴함.  
        },
        { field: "actions", headerName: "선택", cellRenderer: CustomButtonComponent },
        ];
        this.gridOptionsOrder = {
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
    name: "App",
    components: {
        AgGridVue
    },
    methods: {
        async getReturnList() {
            let result = await axios.get(`${ajaxUrl}/returnMt`)
                .catch(err => console.log(err));
            this.returnList = result.data;  //필요없으면 삭제
            this.returnRowData = this.returnList;
        },
        async getOrderList() {
            let result = await axios.get(`${ajaxUrl}/orderMt`)
                .catch(err => console.log(err));
            this.orderList = result.data;  //필요없으면 삭제
            this.orderRowData = this.orderList;
        },
        //날짜 yyyy-MM-dd형식에 맞춰서 가져오기
        customDateFormat(params) {
            console.log(params);
            return userDateUtils.dateFormat(params.data.wrdate, 'yyyy-MM-dd');  //wrdate는 알레아스 이름
        }

    }
};
</script>

