<template>
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
          class="ag-theme-alpine"
        ></AgGridVue>

        <!-- 행 추가/삭제 버튼 -->
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

export default {
  components: {
    AgGridVue,
  },
  data() {
    return {
      // rowData 빈공간 생성
      rowData: [
        { 소모품번호:"", 소모품코드: "", 소모품명: "", 규격x: "", 규격y: "", 규격z: "", 단위: "", 소모량: "" },
      ],
      colDefs: [
        { field: "소모품번호", headerName: "소모품번호", editable: true },
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
  methods: {
    // 그리드 초기화
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    // 행 추가
    addRow() {
      const newRow = { 소모품번호:"", 소모품코드: "", 소모품명: "", 규격x: "", 규격y: "", 규격z: "", 단위: "", 소모량: "" };
      this.rowData = [...this.rowData, newRow];
    },

    // 선택된 행 삭제
    removeRows() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.rowData = this.rowData.filter((row) => !selectedRows.includes(row));
    },
    async cmpdsInsert() {
      console.log("등록 버튼 클릭됨"); // 클릭 시 출력
      console.log(this.rowData);
      let obj = this.rowData.map(row => ({
        cmpds_no: row.소모품번호,
        cmpds_prdlst_code: row.소모품코드,
        cmpds_prdlst_name: row.소모품명,
        stndrd_x: row.규격x,
        stndrd_y: row.규격y,
        stndrd_z: row.규격z,
        unit: row.단위,
        cnsum_count: row.소모량 
      }));
      console.log(obj);

      let result = await axios.post(`${ajaUrl}/bom`, obj)
        .catch(err => console.log(err)); 
      console.log('성공:', result);
    }
  },
};
</script>

<style>
/* 스타일 조정 */
.ag-theme-alpine {
  font-size: 14px;
}
</style>
