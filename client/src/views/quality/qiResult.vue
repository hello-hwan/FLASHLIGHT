<template>
      <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 70%; font-size: 30px;">
                        품질검사결과
                    </th>
                </tr>
            </thead>
        </table>
    <div>
        <ag-grid-vue :rowData="rowData" 
        :columnDefs="colDefs" 
        :gridOptions="gridOptions" style="height: 550px"
        @grid-ready="onGridReady" class="ag-theme-alpine" @cellClicked="onClickRe_no">
        </ag-grid-vue>
    </div>


  <div style="margin-top: 50px">
        <ag-grid-vue :rowData="mtl_rowData" 
        :columnDefs="mtl_colDefs" 
        :gridOptions="gridOptions" style="height: 500px"
        @grid-ready="onGridReady" class="ag-theme-alpine">
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
    name: "App",   
    data() {
        return {
            rowData : [],
            colDefs: [],
            mtl_rowData: [],
            mtl_colDefs: []
            
            
           
      
        };
    },
    created() {
        //검사결과항목 리스트        
        this.colDefs =ref([
            { field: "mtril_check_code",headerName: "품질검사코드"},
            { field: "mtril_name",headerName: "자재명"},
            { field: "mtlty_name",headerName : "거래처명"},
            { field: "test_date",headerName : "검사일자",editable : true} ,
            { field: "empl_no",headerName : "사원번호",editable : true}, 
            { field: "pass_amount",headerName : "합격량",editable : true} 

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
        //불량검사결과 리스트
        this.mtl_colDefs =ref([
            { field: "inspec_item",headerName: "검사항목"},
            { field: "inspec_standard",headerName : "검사기준"},
            { field: "error_amount",headerName : "불량량",editable : true} ,
            { field: "p_result",headerName : "제품검사결과",editable : true} 

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
        this.getre_no();

    },
    methods:{
        async getre_no(){
            let result = await axios.get(`${ajaxUrl}/quality/qiResult`)
                                    .catch(err => console.log(err));
            let re_no = result.data;
            console.log(re_no);
            this.rowData = ref(re_no)   
        },
        async onClickRe_no(event) {
            const reselected = event.data.mtril_check_code; 
            console.log(reselected);
            let result2 = await axios.get(`${ajaxUrl}/quality/qiResult2`)
                                     .catch(err => console.log(err));
            let re_no2 =result2.data;
            this.mtl_rowData = ref(re_no2)
        }

    },        
    components: {
        AgGridVue, // Add Vue Data Grid component
    },
 
};

</script>

