<template>
    <div>

    <!--주문 자재 리스트-->
      <v-card
        class="mx-auto card-custom"
        style=" border-bottom-right-radius: 13px;
                border-bottom-left-radius: 13px;
                margin-bottom: 30px;"
        >
        <template v-slot:title >
          <span class="font-weight-black text-align-center" >검사 통과 자재 리스트</span>
        </template>
    
        <v-card-text class="bg-surface-light pt-4">
            <AgGridVue style=" height: 519px; margin: 0 auto;"
                :rowData="orderRowData"
                :gridOptions="gridOptionsOrder"
                class="ag-theme-alpine"
                id="grid-two"
                overlayNoRowsTemplate="결과 없음">
            </AgGridVue>
        </v-card-text>
      </v-card>

    <!--반환 자재 리스트-->
        <v-card
        class="mx-auto"
        style=" border-bottom-right-radius: 13px;
                border-bottom-left-radius: 13px;"
        >
        <template v-slot:title>
          <span class="font-weight-black text-align-center">반환 자재 리스트</span>
        </template>
    
        <v-card-text class="bg-surface-light pt-4">
            <AgGridVue style=" height: 519px; margin: 0 auto;"
                :rowData="returnRowData"
                :gridOptions="gridOptionsReturn"
                class="ag-theme-alpine"
                id="grid-one"
                overlayNoRowsTemplate="결과 없음">
            </AgGridVue>
        </v-card-text>
      </v-card>
    


    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';
import wrhousingBtn from "@/components/materials/mtWrhousingBtn.vue";

export default {
    data() {
        return {
            returnRowData: [],    
            returnColDefs: [],
            orderRowData: [],    
            orderColDefs: [],
        };
    },
    created() {
        //반환 입고 리스트
        this.getReturnList();
        this.returnColDefs = [
        { field: "lot", hide: true, suppressToolPanel: true}, //hide: true, suppressToolPanel: true --> 행 숨김
        { field: "name", headerName:"자재명"},
        { field: "code", headerName:"자재코드" },
        { field: "qy", headerName:"반환량" },
        { field: "unit", headerName:"단위" },
        { field: "wrdate", headerName:"입고일",
            valueFormatter: this.customDateFormat, //valueFormatter에서 함수를 설정하고 설정한 함수에서 값을 리턴함.  
        },
        { field: "actions", headerName: "선택", cellRenderer: wrhousingBtn },  //버튼 컴포넌트 설정
        ];
        this.gridOptionsReturn = {
                columnDefs: this.returnColDefs,
                pagination: true,
                paginationPageSize: 10,
                paginationPageSizeSelector: [10, 20, 50, 100],
                paginateChildRows: true,
                animateRows: false,
                defaultColDef: {
                    flex: 1,
                    minWidth: 10
                }
            };

        //주문 입고 리스트
        this.getOrderList();

        this.orderColDefs = [
        { field: "checkCode", headerName: "검사코드"},
        { field: "name", headerName:"자재명" },
        { field: "code", headerName:"자재코드" },
        { field: "qy", headerName:"검사 통과량" },
        { field: "unit", headerName:"단위" },
        { field: "wrdate", headerName:"입고일",
            valueFormatter: this.customDateFormat, //valueFormatter에서 함수를 설정하고 설정한 함수에서 값을 리턴함.  
        },
        { field: "actions", headerName: "선택", cellRenderer: wrhousingBtn },
        ];
        this.gridOptionsOrder = {
                columnDefs: this.orderColDefs,
                pagination: true,
                paginationPageSize: 10,
                paginationPageSizeSelector: [10, 20, 50, 100],
                paginateChildRows: true,
                animateRows: false,
                defaultColDef: {
                    flex: 1,
                    minWidth: 10
                },
            };
    },
    name: "App",
    components: {
        AgGridVue,
    },
    methods: {
        //반환
        async getReturnList() {
            let result = await axios.get(`${ajaxUrl}/mtril/returnMt`)
                .catch(err => console.log(err));
            this.returnRowData = result.data;
        },
        //검사 통과 자재
        async getOrderList() {
            let result = await axios.get(`${ajaxUrl}/mtril/orderMt`)
                .catch(err => console.log(err));
            console.log("검사통과 자재:", result);
            this.orderRowData = result.data;
        },
        //날짜 yyyy-MM-dd형식에 맞춰서 가져오기
        customDateFormat(params) {
            //onsole.log(params);
            return userDateUtils.dateFormat(params.data.wrdate, 'yyyy-MM-dd');  //wrdate는 알레아스 이름
        }

    }
};
</script>

<style scoped>
.card-custom {
    border-bottom-right-radius: 13px;
    border-bottom-left-radius: 13px;
    margin-bottom: 30px;
}
.text-align-center {
    display: flex;
    justify-content: center;
}

</style>