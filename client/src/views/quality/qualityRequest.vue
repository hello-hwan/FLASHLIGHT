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
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="prd_cd">
            </div> 
            <div class="col-auto">
                <span class="form-text">
                    <button type="button" class="btn btn-xs btn-info" @click="getinspec_prd()">검색</button>
                </span>
            </div>         
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">품질검사코드</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="mtr_cd">
            </div>
          
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">발주번호</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="ord_no">
            </div>
           
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">자재명</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" v-model="mtr_name">
            </div>           
        </div>    

        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">검사일자</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="date">
            </div>
           
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">거래처코드</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="bc_code">
            </div>
            
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">거래처명</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="mtl_name">
            </div>
           
        </div>
        <div class="row g-3 align-items-center">
            <div class="col-1">
                <label for="inputPassword6" class="col-form-label">합격량</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline"  v-model="pass_num">
            </div>           
        </div>      
        
        
</div>
<div class="businessOrderListTitle">
        검사상세항목
</div>     


<div>
    <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 500px"
            @grid-ready="onGridReady" class="ag-theme-alpine">
        </ag-grid-vue>
</div>

<div>

    <button type="button" class="btn btn-primary">등록</button>
    <button type="button" class="btn btn-warning">초기화</button>

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
    name: "App",
    data() {
        return {            
            rowData: [],
            colDefs: [],
            prd_cd: '',
            mtr_cd:'',
            ord_no:'',
            mtr_name:'',
            date:'',
            bc_code:'',
            mtl_name:'',
            pass_num:''
        };
    },
    created() {        
        this.colDefs =ref([
            { field: "inspec_item",headerName: "검사항목"},
            { field: "inspec_standard",headerName : "검사기준"},
            { field: "error_amount",headerName : "불량량",editable : true}
        ]);

        this.gridOptions = {
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
    components: {
        AgGridVue, // Add Vue Data Grid component
    },
    methods: {
        async getinspec_prd() {
            let result = await axios.get(`${ajaxUrl}/quality/inspec_prd?re_info=${this.prd_cd}`)
                .catch(err => console.log(err));
            this.inspec_prd = result.data;
            this.rowData = ref(this.inspec_prd);
            this.mtr_cd = this.rowData[0].mtril_check_code
            this.ord_no = this.rowData[0].order_no
            this.mtr_name = this.rowData[0].mtril_name
            this.date = this.rowData[0].test_date
            this.bc_code = this.rowData[0].bcnc_code
            this.mtl_name = this.rowData[0].mtlty_name                    
        }

        
    }
};

</script>
<style >
  

</style>
