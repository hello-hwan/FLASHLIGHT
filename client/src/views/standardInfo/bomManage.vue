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
    
    async update(){

      // let test = {...this.rowData};
      // console.log(test[0].prdlst_code);
      // console.log(this.rowData);
      // const componentsObj = this.rowData.map((row) => ({
      //   prdlst_code: test.prdlst_code,
      //   cmpds_prdlst_code: test.cmpds_prdlst_code,
      //   cmpds_prdlst_name: test.cmpds_prdlst_name,
      //   stndrd_y: test[0].stndrd_y,
      //   unit: test.unit,
      //   cnsum_count: test.cnsum_count,
      // }));
      // console.log('test',componentsObj);

      // for(let i = 0; i <= this.rowData.length; i++){
      //   this.obj = {
      //     prdlst_code: this.rowData[i].prdlst_code,
      //     prdist_name: this.rowData[i].prdist_name,
      //     prdctn_qy: this.rowData[i].prdctn_qy,
      //     cmpds_prdlst_code: this.rowData[i].cmpds_prdlst_code,
      //     cmpds_prdlst_name: this.rowData[i].cmpds_prdlst_name
      //   }
      //   console.log(i);
      //   console.log(this.obj);
      // }
      // console.log('obj',this.obj);
      // let result = await axios.put(`${ajaxUrl}/bom_cmpsdUpdate/${this.rowData}`)
      //                         .catch(err => console.log(err));
      // let updateRes = result.data;
      // if(updateRes.result){
      //         lert('수정되었습니다.');
      // }
    }, 
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