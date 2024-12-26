<template>
    <div class="businessOrderListTitle">
       검사항목검색
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
                   <button type="button" class="btn btn-xs btn-info" @click="getqiList()">검색</button>
               </span>
           </div>
       </div>
   <div>
    <div>
        <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :gridOptions="gridOptions" style="height: 500px"
                @grid-ready="onGridReady" class="ag-theme-alpine">
            </ag-grid-vue>
    </div>
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
           qiList: [],
           rowData: [],
           colDefs: [],
           prd_cd: '',
       };
   },
   created() {        
       this.colDefs =ref([
           { field: "inspec_item",headerName: "검사항목"},
           { field: "inspec_standard",headerName : "검사기준"}
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
   name: "App",
   components: {
       AgGridVue, // Add Vue Data Grid component
   },
   methods: {
       async getqiList() {
           let result = await axios.get(`${ajaxUrl}/standardInfo/qiList?qi_info=${this.prd_cd}`)
               .catch(err => console.log(err));
           this.qiList = result.data;
           this.rowData = ref(this.qiList);

       }
   }
};
</script>