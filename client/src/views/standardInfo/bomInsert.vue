<template>
  <div>
    <div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">BOM코드</label>
  </div>
  <div class="col-auto">
    <input type="text" id="bomcode" class="form-control" aria-describedby="passwordHelpInline">
  </div>
  <div class="col-auto">
    <button type="button" class="btn btn-primary" @click="">검색</button>
  </div>
</div>
    <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
    <template v-slot:title>
        <span class="font-weight-black">BOM조회</span>
    </template>

    <v-card-text class="bg-surface-light pt-4">
        <AgGridVue style=" height: 500px; margin: 0 auto;"
            @grid-ready="onGridReady"
            :rowData="rowDataSelect"
            :columnDefs="colDefsSelect"
            :rowSelection="rowSelection"
            @cellClicked="onCellClicked"
            :gridOptions="gridOptionsReturn"
            class="ag-theme-alpine"
            id="grid-one">
        </AgGridVue>
    </v-card-text>
    </v-card>
  </div>

  <div>
    <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
      <template v-slot:title>
        <span class="font-weight-black">소요재료</span>
      </template>

      <v-card-text class="bg-surface-light pt-4">
        <AgGridVue
          style="height: 300px; margin: 0 auto;"
          @grid-ready="onGridReady"
          :rowData="rowData"
          :columnDefs="colDefs"
          :defaultColDef="defaultColDef"
          :gridOptions="gridOptions"
          class="ag-theme-alpine">
        </AgGridVue>

        <div style="margin-top: 20px; text-align: right;">
          <button class="btn btn-primary" @click="addRow">행 추가</button>
          <button class="btn btn-danger" @click="removeRows">선택된 행 삭제</button>
        </div>
      </v-card-text>
    </v-card>
        <div> 
          <button class="btn btn-primary" @click="cmpdsInsert">등록</button>
        </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';


export default {
  components: {
    AgGridVue,
  },
  data() {
    return {
      bomcode: {
        bomcode: ''
      },
      bomList: [],
      rowDataSelect: '',
      colDefsSelect: '',
      // rowData 빈공간 생성
      rowData: [
        { 소모품번호:"", bom코드:"", 소모품코드: "", 소모품명: "", 규격x: "", 규격y: "", 규격z: "", 단위: "", 소모량: "" },
      ],
      colDefs: [
        { field: "소모품번호", headerName: "소모품번호", editable: true },
        { field: "bom코드", headerName: "bom코드", editable: true },
        { field: "소모품코드", headerName: "소모품코드", editable: true },
        { field: "소모품명", headerName: "소모품명", editable: true },
        { field: "규격x", headerName: "규격x", editable: true },
        { field: "규격y", headerName: "규격y", editable: true },
        { field: "규격z", headerName: "규격z", editable: true },
        { field: "단위", headerName: "단위", editable: true },
        { field: "소모량", headerName: "소모량", editable: true },
      ],
      defaultColDef: {
        resizable: true,
        sortable: true,
        flex: 1,
        minWidth: 100,
      },
      gridOptions: {
        rowSelection: "single", // 단일 행 선택
      },
    };
  },
  created(){
    // this.getbomList();
    // this.colDefs = ([
    //       { field: "cmpds_no", headerName:"소모품코드" },
    //       { field: "cmpds_prdlst_name", headerName:"소모품명" },
    //       { field: "stndrd_x", headerName:"규격x" },
    //       { field: "stndrd_y", headerName:"규격y" },
    //       { field: "stndrd_z", headerName:"규격z" },
    //       { field: "unit", headerName:"단위" },
    //       { field: "cnsum_count", headerName:"소모량" }
    // ])
    // this.gridOptionsReturn = {
    //             columnDefs: this.returnColDefs,
    //             pagination: true,
    //             paginationPageSize: 10,
    //             paginationPageSizeSelector: [10, 20, 50, 100],
    //             paginateChildRows: true,
    //             animateRows: false,
    //             defaultColDef: {
    //                 filter: true,
    //                 flex: 1,
    //                 minWidth: 10
    //             }
    //         };
  },
  methods: {
    // getbomList() {
    //       let bomcode = this.bomcode;
    //       console.log(this.bomcode);
    //       console.log('bomcode',bomcode);
    //       let result = axios.get(`${ajaxUrl}/bom/${bomcode}`)
    //           .catch(err => console.log(err));
    //       this.bomList = result.data; 
    //       this.rowDataSelect = this.bomList;
    //   },
    // 그리드 초기화
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    // 행 추가
    addRow() {
      const newRow = { 소모품번호:"",bom코드:"" , 소모품코드: "", 소모품명: "", 규격x: "", 규격y: "", 규격z: "", 단위: "", 소모량: "" };
      this.rowData = [...this.rowData, newRow];
    },

    // 선택된 행 삭제
    removeRows() {  
      const selectedRows = this.gridApi.getSelectedRows();
      this.rowData = this.rowData.filter((row) => !selectedRows.includes(row));
    },
    async cmpdsInsert() {
      let obj = this.rowData.map(row => ({  
        cmpds_no: row.소모품번호,
        bom_code: row.bom코드, 
        cmpds_prdlst_code: row.소모품코드,   
        cmpds_prdlst_name: row.소모품명, 
        stndrd_x: row.규격x,
        stndrd_y: row.규격y,
        stndrd_z: row.규격z,  
        unit: row.단위,  
        cnsum_count: row.소모량, 
      })); 

      console.log('obj',obj);
      let result = await axios.post(`${ajaxUrl}/bom`, obj).catch(err => {
        console.error('요청 중 오류:', err);
        return { data: null }; // 기본값 설정 
      });
 
      if (result?.data) {
        console.log('등록 성공:', result.data);
      } else {
        console.error('등록 실패: 응답 데이터가 없습니다.');  
      } 
      
    },
  },
}
</script>

<style>
/* 스타일 조정 */
.ag-theme-alpine {
  font-size: 14px;
}
</style>
