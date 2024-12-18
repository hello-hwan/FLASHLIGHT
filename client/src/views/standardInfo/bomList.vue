<template>
    <div>
    <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
        <template v-slot:title>
            <span class="font-weight-black">BOM조회</span>
        </template>

        <v-card-text class="bg-surface-light pt-4">
            <AgGridVue style=" height: 500px; margin: 0 auto;"
                @grid-ready="onGridReady"
                :rowData="rowData"
                :columnDefs="colDefs"
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
            <span class="font-weight-black">BOM상세조회</span>
        </template>

        <v-card-text class="bg-surface-light pt-4">
            <AgGridVue style=" height: 100px; margin: 0 auto;"
                @grid-ready="onGridReady"
                :rowData="rowDataSelect"
                :columnDefs="colDefsSelect"
                :rowSelection="rowSelection"
                :gridOptions="gridOptionsReturn"
                class="ag-theme-alpine"
                id="grid-one">
            </AgGridVue>
            <AgGridVue style=" height: 500px; margin: 0 auto;"
                @grid-ready="onGridReady"
                :rowData="rowDataInfo"
                :columnDefs="colDefsInfo"
                :rowSelection="rowSelection"
                :gridOptions="gridOptionsReturn"
                class="ag-theme-alpine"
                id="grid-one">
            </AgGridVue>
        </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

export default {
  data() {
    return {
      bomList: [], // BOM 리스트
      rowData: '', // BOM 데이터
      colDefs: '', // BOM 컬럼 정의

      rowDataSelect: '', // 선택된 BOM 데이터
      colDefsSelect: '', // 선택된 BOM 컬럼 정의

      bomListInfo: [], // 상세보기 리스트
      rowDataInfo: '', // 상세보기 데이터
      colDefsInfo: '', // 상세보기 컬럼 정의

      gridOptionsReturn: {}, // AgGrid 옵션
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

    // 선택 데이터 그리드 초기화
    this.colDefsSelect = [
      { field: "bom_code", headerName: "BOM코드" },
      { field: "prdlst_code", headerName: "제품코드" },
      { field: "prdist_name", headerName: "제품명" },
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
  name: "App",
  components: {
    AgGridVue, // Vue Data Grid component
  },
  methods: {
    onCellClicked(event) {
      if (event.colDef.field === "상세보기") {
        this.selectedBomCode = event.data.bom_code; // 상세보기를 위한 데이터 추츨
        console.log(`선택된 BOM 코드: ${this.selectedBomCode}`);
        this.getbomSelect(event.data); // 선택된 데이터 전달
        this.getbomListInfo(this.selectedBomCode); // 상세 정보 조회
      }
    },
    async getbomList() {
        let result = await axios.get(`${ajaxUrl}/bom`)
              .catch(err => console.log(err));
          this.bomList = result.data;
          this.rowData = this.bomList;
    },
    getbomSelect(selectedData) {
      // 선택된 데이터를 rowDataSelect에 설정
      this.rowDataSelect = [selectedData];
      console.log('this.rowDataSelect',this.rowDataSelect);
    },
    async getbomListInfo(bomCode) {
        let result = await axios.get(`${ajaxUrl}/bom/${bomCode}`)
              .catch(err => console.log(err));
          this.bomListInfo = result.data;
          this.rowDataInfo = this.bomListInfo;
    },
  },
};
</script>
