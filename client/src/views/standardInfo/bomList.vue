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
  
          <!-- BOM 상세조회 -->
          <v-col cols="6">
            <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
              <template v-slot:title>
                <span class="font-weight-black">BOM상세조회</span>
              </template>
              <v-card-text class="bg-surface-light pt-4">
                <!-- 상세보기 데이터 -->
                <AgGridVue
                  style="height: 500px; margin: 0 auto;"
                  @grid-ready="onGridReady"
                  :rowData="rowDataInfo"
                  :columnDefs="colDefsInfo"
                  :rowSelection="rowSelection"
                  :gridOptions="gridOptionsReturn"
                  class="ag-theme-alpine"
                  id="grid-info"
                >
                </AgGridVue>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
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
    },
    methods: {
      onCellClicked(event) {
        if (event.colDef.field === "상세보기") {
          this.selectedBomCode = event.data.bom_code; // 상세보기를 위한 데이터 추츨
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
          let result = await axios.get(`${ajaxUrl}/bom/${bomCode}`)
                                    .catch(err => console.log(err));
          this.bomListInfo = result.data;
          this.rowDataInfo = this.bomListInfo;
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
    },
    components: {
      AgGridVue,
    },
  };
  </script>
  