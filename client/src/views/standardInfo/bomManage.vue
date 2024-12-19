<template>
  <div>
    <div class="row g-3 align-items-center mb-4">
      <div class="col-auto">
        <label for="prdlstCode" class="col-form-label">품목코드</label>
      </div>
      <div class="col-auto">
        <input type="text" id="prdlstCode" class="form-control" v-model="search.prdlstCode" @change="fetchItemData" placeholder="품목코드를 입력하세요" />
      </div>
      <div class="col-auto">
        <label for="prdlstName" class="col-form-label">품목명</label>
      </div>
      <div class="col-auto">
        <input type="text" id="prdlstName" class="form-control" v-model="prdlstName" readonly />
      </div>
      <div class="col-auto">
        <label for="productionQty" class="col-form-label">기본생산수량</label>
      </div>
      <div class="col-auto">
        <input type="text" id="productionQty" class="form-control" v-model="productionQty" />
      </div>
    </div>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
              <span class="font-weight-black">소모품 데이터</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <AgGridVue
                style="width: 100%; height: 65vh; margin: 0 auto;"
                :rowData="rowData"
                :columnDefs="colDefs"
                :gridOptions="gridOptions"
                @cellClicked="onCellClicked"
                @grid-ready="onGridReady"
                class="ag-theme-alpine">
              </AgGridVue>
              <div class="mt-3">
                <button class="btn btn-primary me-2" @click="addRow">행 추가</button>
                <button class="btn btn-danger" @click="deleteRow">행 삭제</button>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <div class="row mt-4">
      <div class="col-12">
        <label for="remarks" class="form-label">적요</label>
        <textarea
          id="remarks"
          class="form-control"
          rows="3"
          v-model="remarks"
          placeholder="적요를 입력하세요"
        ></textarea>
      </div>
      <div class="col-12 mt-3">
        <button class="btn btn-success" @click="saveData">저장</button>
        <button class="btn btn-success" @click="update">수정</button>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from "axios";
import { ajaxUrl } from "@/utils/commons.js";

export default {
  data() {
    return {
      search: {
        prdlstCode: "",
      },
      prdlstName: "", 
      productionQty: "",
      rowData: [],
      colDefs: [],
      gridOptions: {}, 
      remarks: "", 
      obj: {
        prdlst_code: '',
        prdist_name: '',
        prdctn_qy: '',
        cmpds_prdlst_code: '',
        cmpds_prdlst_name: ''
      }
    };
  },
  created() {
    this.colDefs = [
      { field: "cmpds_prdlst_code", headerName: "소모코드", editable: true },
      { field: "cmpds_prdlst_name", headerName: "소모품명", editable: true },
      { field: "stndrd_y", headerName: "규격", editable: true },
      { field: "unit", headerName: "단위", editable: true },
      { field: "cnsum_count", headerName: "소모량", editable: true },
    ];

    this.gridOptions = {
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        editable: true,
        flex: 1,
        minWidth: 10,
      },
      rowSelection: "single", 
    };
  },
  methods: {
    // 품목코드를 입력하고 데이터를 가져오는 메서드
    async fetchItemData() {
      let result = await axios.get(`${ajaxUrl}/bomManage/${this.search.prdlstCode}`)
                              .catch((err) => console.log(err));
      if (result) {
        this.prdlstName = result.data[0].prdist_name;
        this.productionQty = result.data[0].prdctn_qy;
        this.rowData = result.data;
        
        console.log(result.data.length);

        // this.result.api.setRowData(this.rowData);
      }
    },
    // 그리드에 새로운 행을 추가하는 메서드
    addRow() {
      const newRow = {
        cmpds_no: "",
        cmpds_prdlst_name: "",
        stndrd_y: "",
        unit: "",
        cnsum_count: "",
      };
      this.gridOptions.api.applyTransaction({ add: [newRow] });
    },
    // 선택한 행을 삭제하는 메서드
    deleteRow() {
      const selectedNodes = this.gridOptions.api.getSelectedNodes();
      if (selectedNodes.length) {
        const selectedData = selectedNodes.map((node) => node.data);
        this.gridOptions.api.applyTransaction({ remove: selectedData });
      } else {
        alert("삭제할 행을 선택하세요.");
      }
    },
    // 데이터를 저장하는 메서드
    async saveData() { 
      let result = await axios.post(`${ajaxUrl}/save`, {
          prdlstCode: this.search.prdlstCode,
          productionQty: this.productionQty,
          remarks: this.remarks,
          components: this.rowData,
        })
        .catch((err) => console.log(err));
        console.log(result.data);
      if (result) {
        alert("저장되었습니다.");
      }
    },
    
    async update() {
  // rowData 배열을 순회하면서 각 항목을 업데이트하기 위한 API 호출 준비
  for (let i = 0; i < this.rowData.length; i++) {
    let row = this.rowData[i];
    let obj = {
      cnsum_count: row.cnsum_count
    };

    try {
      // 각 객체를 서버에 보내는 비동기 요청
      let result = await axios.put(`${ajaxUrl}/bom_cmpsdUpdate/${row.cmpds_no}`, obj);
      
      // 응답 상태 확인
      if (result.data.result) {
        console.log(`업데이트 성공: ${row.cmpds_no}`);
      } else {
        console.error(`업데이트 실패: ${row.cmpds_no}`);
        alert(`소모품 코드 ${row.cmpds_no}에 대한 수정에 실패했습니다.`);
        return;  // 실패하면 나머지 요청을 하지 않고 종료
      }
    } catch (err) {
      // 오류 처리
      console.error('업데이트 오류 발생:', err);
      alert(`소모품 코드 ${row.cmpds_no}에 대한 수정 중 오류가 발생했습니다.`);
      return;  // 실패하면 나머지 요청을 하지 않고 종료
    }
  }

  // 모든 업데이트가 완료되면 성공 메시지
  alert('모든 소모품 데이터가 성공적으로 수정되었습니다.');
} , 
    // 셀 클릭 시의 이벤트 핸들러 
    onCellClicked(event) {
      console.log("선택된 셀:", event);
    },
    // 그리드 준비 완료 후 실행되는 메서드
    onGridReady(params) {
      this.gridOptions.api = params.api;
      this.gridOptions.columnApi = params.columnApi;
    },
  },
  components: {
    AgGridVue,
  },
};
</script>

<style scoped>

</style>