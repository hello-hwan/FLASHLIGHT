<template>
<div class="businessOrderListTitle">
        입고품질검사
</div>     
<div class="container">
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">품목코드</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div> 
            <div class="col-auto">
                <span class="form-text">
                    <button type="button" class="btn btn-xs btn-info" @click="getqualityRequest()">검색</button>
                </span>
            </div>         
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">품질검사코드</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>
          
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">발주번호</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>
           
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">자재명</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>           
        </div>
        
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">검사자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>           
        </div>

        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">검사일자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>
           
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">거래처코드</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>
            
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">거래처명</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>
           
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">합격량</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
            </div>           
        </div>      
        
        
</div>
<div class="businessOrderListTitle">
        검사상세항목
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
            { field: "prd_code",headerName: "검사항목"},
            { field: "mtril_name",headerName : "검사기준"},
            { field: "error_amount",headerName : "불량량"},
           
        

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
<style >
  

</style>
