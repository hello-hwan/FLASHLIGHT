<template>
    <!--주문 자재 리스트-->
    <div>
        <AgGridVue style="width: 1000px; height: 500px;"
            @grid-ready="onGridReady"
            :defaultColDef="defaultColDef"
            :rowData="rowData"
            :gridOptions="gridOptionsOrder"
            :domLayout="'autoHeight'"
            class="ag-theme-alpine"
            id="grid-two">
        </AgGridVue>
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';
import CustomButtonComponent from "@/components/materials/wrhousingButtonComponent.vue";

export default {
    data() {
        return {
            returnList: [], //데이터 가져온 결과
            rowData: [],    
            colDefs: [],
        };
    },
    created() {
        console.log('주문 컴포넌트');
        this.getReturnList();
        this.colDefs = [
        { field: "checkCode", headerName: "검사코드"},
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
                columnDefs: this.colDefs,
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
                suppressAnimationFrame: true,
            };
    },
    name: "App",
    components: {
        AgGridVue
    },
    methods: {
        async getReturnList() {
            let result = await axios.get(`${ajaxUrl}/orderMt`)
                .catch(err => console.log(err));
            this.returnList = result.data;  //필요없으면 삭제
            this.rowData = this.returnList;
            console.log(this.rowData);
        },
        //날짜 yyyy-MM-dd형식에 맞춰서 가져오기
        customDateFormat(params) {
            console.log(params);
            return userDateUtils.dateFormat(params.data.wrdate, 'yyyy-MM-dd');  //wrdate는 알레아스 이름
        }

    }
};
</script>
