<template>
<div class="businessOrderListTitle">
        입고품질검사
</div>     
<div class="row g-3 align-items-center">
            <div class="col-2">
                <label for="inputPassword6" class="col-form-label">품목코드</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="prd_cd">
            </div>
            <div class="col-auto">
                <span class="form-text">
                    <button type="button" class="btn btn-xs btn-info" @click="getqualityRequest()">검색</button>
                </span>
            </div>
        </div>
    <div>   
</div>   
<div>
    <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" style="height: 500px" class="ag-theme-alpine">
    </ag-grid-vue>
</div> 
</template>

<script>
import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

export default {
    data() {
        return {            
            rowData: [],
            colDefs: [],
            prd_cd: '',
        };
    },
    created() {        
        this.colDefs =ref([
            { field: "prd_code",headerName: "품목코드"},
            { field: "mtril_name",headerName : "자재명"},
            { field: "rec_num",headerName : "입고수량"},
            { field: "mtril_check_code",headerName : "품질검사코드"},
            { field: "test_date",headerName : "검사일자"},
            { field: "order_code",headerName : "발주코드"},
            { field: "mtlty_name",headerName : "거래처명"},
            { field: "manager",headerName : "검사자"},
            { field: "amount",headerName : "합격량"},
            { field: "erorr",headerName : "불량량"},
        

        ]);
    },
    name: "App",
    components: {
        AgGridVue, // Add Vue Data Grid component
    },
    methods: {
        async getqualityRequest() {
            let result = await axios.get(`${ajaxUrl}/quality/qualityRequest?re_info=${this.prd_cd}`)
                .catch(err => console.log(err));
            this.qualityRequest = result.data;
            this.rowData = ref(this.qualityRequest);

        }
    }
};

</script>

