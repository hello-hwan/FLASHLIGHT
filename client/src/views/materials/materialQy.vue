<template>
    <!--반환 자재 리스트-->
    <v-card
        class="mx-auto"
        style=" border-bottom-right-radius: 13px;
                border-bottom-left-radius: 13px;"
        >
        <template v-slot:title>
          <span class="font-weight-black">자재별 재고 수량</span>
        </template>
    
        <v-card-text class="bg-surface-light pt-4">
            <!--ag grid영역-->
            <AgGridVue style=" height: 519px; margin: 0 auto;"
                :rowData="mtRowData"
                :gridOptions="gridOptions"
                class="ag-theme-alpine">
            </AgGridVue>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { ref } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

//버튼가져오기
import switchBtn from '@/components/materials/switchLotQy.vue';

//행 데이터
const mtRowData = ref([]);
//열정보
const mtColDefs = [
        { field: "mtril_name", headerName:"자재명"},
        { field: "mtril_code", headerName:"자재코드"},
        { field: "qy", headerName:"자재수량" },
        { field: "unit", headerName:"단위" },
        { field: "sfinvc", headerName:"안전재고 수량" },
        { headerName: "선택", cellRenderer: switchBtn}  //버튼 컴포넌트 설정
        ];

const gridOptions = {
    columnDefs: mtColDefs,
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

//데이터 가져오기
const getMtrilQy = async() => {
    let result = await axios.get(`${ajaxUrl}/mtril/mtAllQy`)
                            .catch(err=> console.log(err));

    console.log(result.data);
    //행 데이터 담기
    mtRowData.value = result.data;
};
getMtrilQy();
</script>
