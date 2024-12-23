<template>
    <div>
      <v-container fluid>
        <v-row>
          <!-- 검색 필드 -->
          <v-col cols="12" class="mb-4">
            <v-card class="mx-auto" style="border-radius: 13px;">
              <v-card-text class="bg-surface-light pt-4">
                <div class="row g-3 align-items-center">
                  <div class="col-auto">
                    <label for="itemCode" class="col-form-label">품목코드</label>
                  </div>
                  <div class="col-auto">
                    <input type="text" id="itemCode" class="form-control" v-model="searchCode" placeholder="품목코드를 입력하세요" />
                  </div>
                  <div class="col-auto">
                    <button class="btn btn-primary" @click="filterByCode">검색</button>
                  </div>
                  <div class="col-auto">
                    <button class="btn btn-secondary" @click="resetFilter">초기화</button>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <v-row>
          <!-- BOM 조회 -->
          <v-col cols="6">
            <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
              <template v-slot:title>
                <span class="font-weight-black">BOM조회</span>
              </template>
              <v-card-text class="bg-surface-light pt-4">
                <AgGridVue
                  style="height: 500px; margin: 0 auto;"
                  @grid-ready="onGridReady"
                  :rowData="filteredRowData"
                  :columnDefs="colDefs"
                  :rowSelection="rowSelection"
                  @cellClicked="onCellClicked"
                  :gridOptions="gridOptionsReturn"
                  class="ag-theme-alpine"
                  id="grid-one"
                >
                </AgGridVue>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div>
    <div class="row g-3 align-items-center mb-4">
      <div class="col-auto">
        <label for="prdlstCode" class="col-form-label">품목코드</label>
      </div>
      <div class="col-auto">
        <input type="text" id="prdlstCode" class="form-control" v-model="prdlstCode" @change="fetchItemData" readonly/>
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
                :rowData="rowDataInfo"
                :columnDefs="colDefsInfo"
                :gridOptions="gridOptions" 
                @cellClicked="onCellClicked2"
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
        bomList: [], // BOM 리스트
        rowData: [], // BOM 데이터
        filteredRowData: [], // 검색된 데이터
        colDefs: [], // BOM 컬럼 정의
  
        bomListInfo: [], // 상세보기 리스트
        rowDataInfo: [], // 상세보기 데이터
        colDefsInfo: [], // 상세보기 컬럼 정의
  
        gridOptionsReturn: {}, // AgGrid 옵션
  
        searchCode: "", // 검색 입력값
        prdlstCode: this.prdlst_code,
        prdlstName: this.prdist_name, 
        productionQty: "",
        remarks: "", 
        rowCount: 0
      };
    },
    created() {
      this.getbomList();
  
      // BOM 조회 컬럼 정의
      this.colDefs = [
        { field: "bom_code", headerName: "BOM코드" },
        { field: "prdlst_code", headerName: "제품코드" },
        { field: "prdist_name", headerName: "제품명" },
        { field: "prdctn_qy", headerName: "기본생산수량" },
        { field: "상세보기", headerName: "상세보기", cellRenderer: () => "상세보기" },
      ];
  
      // 상세보기 컬럼 정의
      this.colDefsInfo = [
        { field: "cmpds_no", headerName: "소모품코드" },
        { field: "prdlst_code", headerName: "소모품코드" },
        { field: "cmpds_prdlst_name", headerName: "소모품명" },
        { field: "stndrd_y", headerName: "규격" },
        { field: "unit", headerName: "단위" },
        { field: "cnsum_count", headerName: "소모량" },
      ];
  
      // AgGrid 기본 옵션 설정
      this.gridOptionsReturn = {
        pagination: true,
        paginationPageSize: 10,
        paginationPageSizeSelector: [10, 20, 50, 100],
        animateRows: false,
        defaultColDef: {
          filter: true,
          flex: 1,
          minWidth: 10,
        },
      };
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
      onCellClicked(event) {
        if (event.colDef.field === "상세보기") {
          this.selectedBomCode = event.data.prdlst_code; // 상세보기를 위한 데이터 추츨
          console.log(`선택된 BOM 코드: ${this.selectedBomCode}`);
          this.getbomListInfo(this.selectedBomCode); // 상세 정보 조회
        }
      },
      async getbomList() {
          let result = await axios.get(`${ajaxUrl}/bom`)
                            .catch(err => console.log(err));
          this.bomList = result.data;
          this.rowData = this.bomList;
          this.filteredRowData = this.rowData; // 초기 데이터 설정
      },
      async getbomListInfo(bomCode) {
        let result = await axios.get(`${ajaxUrl}/bomManage/${bomCode}`)
                                    .catch(err => console.log(err));
          this.bomListInfo = result.data;
          this.rowDataInfo = this.bomListInfo;
          if (result) {
            this.prdlstCode = result.data[0].prdlst_code;
            this.prdlstName = result.data[0].prdist_name;
            this.productionQty = result.data[0].prdctn_qy;
            this.rowData = result.data;
        
            this.rowCount = this.rowData.length;
        }
      },
      filterByCode() {
        // 품목코드로 필터링
        this.filteredRowData = this.rowData.filter((row) =>
          row.prdlst_code.includes(this.searchCode)
        );
      },
      resetFilter() {
        // 필터 초기화
        this.searchCode = "";
        this.filteredRowData = this.rowData;
      },
      addRow() {
        const newRow = {
          cmpds_no: "",
          cmpds_prdlst_code: "",
          cmpds_prdlst_name: "",
          stndrd_y: "",
          unit: "",
          cnsum_count: "",
        };
        this.rowDataInfo = [...this.rowDataInfo, newRow];
      },
      // 선택한 행을 삭제하는 메서드
      deleteRow() {
        const selectedNodes = this.gridOptions.api.getSelectedNodes();

        if (selectedNodes.length === 0) {
          alert("삭제할 행을 선택하세요.");
          return;
        }

        // 선택된 데이터
        const selectedData = selectedNodes.map((node) => node.data);

        // Vue 데이터에서 제거
        this.rowDataInfo = this.rowDataInfo.filter(
          (row) => !selectedData.some((selected) => selected.cmpds_no === row.cmpds_no)
        );

        // Ag-Grid에서 데이터 제거
        this.gridOptions.api.applyTransaction({ remove: selectedData });

        // API 호출로 데이터 삭제
        selectedData.forEach((data) => {
          if (data.cmpds_no) {
            axios
              .delete(`${ajaxUrl}/bom_cmpdsDel/${data.cmpds_no}`)
              .then(() => console.log(`행 삭제 완료: ${data.cmpds_no}`))
              .catch((err) => console.error(`행 삭제 실패: ${data.cmpds_no}`, err));
          }
        });
      },
      // 데이터를 저장하는 메서드
      async saveData() { 
        console.log(this.rowCount);
        console.log(this.rowDataInfo.length);
        for(let i = this.rowCount; i < this.rowDataInfo.length; i ++) {
          let row = this.rowDataInfo[i];
          let obj = {
            cmpds_no: row.cmpds_no,
            bom_code: this.rowData[0].bom_code,
            cmpds_prdlst_code: row.cmpds_prdlst_code,
            cmpds_prdlst_name: row.cmpds_prdlst_name, 
            stndrd_y: row.stndrd_y,
            unit: row.unit,
            cnsum_count: row.cnsum_count
          }
          console.log(obj);
          let result = await axios.post(`${ajaxUrl}/bom`, obj)
                                  .catch(err => console.log(err));           
        }
        
      },
      async update(){
        for(let i = 0; i < this.rowData.length; i ++) {
          let row = this.rowData[i];
          let obj = {
            cnsum_count: row.cnsum_count
          }
          console.log('obj',obj);
          console.log('row',row);
          let result = await axios.put(`${ajaxUrl}/bom_cmpsdUpdate/${this.rowData[i].cmpds_no}`,obj)
                                        .catch(err => console.log(err));
        }
      },
      // 셀 클릭 시의 이벤트 핸들러 
      onCellClicked2(event) {
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
  