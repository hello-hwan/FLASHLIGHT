<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <template v-slot:title>
              <span class="font-weight-black">반제품 출고 조회</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- 필터 검색 필드 -->
              <div class="row g-3 align-items-center">
                <!-- 반제품LOT번호 -->
                <div class="col-1">
                  <label for="itemCode" class="col-form-label">요청명</label>
                </div>
                <div class="col-2">
                  <input type="text" id="itemCode" class="form-control" v-model="prductNReqName" />
                </div>
                <!-- 품목코드 --> 
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">반제품명</label>
                </div>
                <div class="col-2">
                  <input type="text" id="itemCode" class="form-control" v-model="prdlstCode" />
                </div>
                <!-- 입고일자 -->
                <div class="col-auto">
                  <label for="startDate" class="col-form-label">요청일</label>
                </div>
                <div class="col-auto">
                  <input type="date" id="startDate" class="form-control" v-model="startDate" :max="endDate"/>
                </div>
                <div class="col-auto">
                  <label for="endDate" class="col-form-label">-</label>
                </div>
                <div class="col-auto">
                  <input type="date" id="endDate" class="form-control" v-model="endDate" :min="startDate"/>
                </div>
              </div>

              <!-- 버튼 영역 (아래쪽 중앙 정렬) -->
              <div class="d-flex justify-content-center mt-4">
                <button class="btn btn-primary mx-2" @click="filterByCode">검색</button>
                <button class="btn btn-secondary mx-2" @click="resetFilter">초기화</button>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 그리드 영역 -->
      <v-row>
        <v-col cols="12">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
              <span class="font-weight-black">반제품 출고 리스트</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- AgGrid -->
              <AgGridVue
                style="height: 400px; margin: 0 auto;"
                @grid-ready="onGridReady"
                :rowData="filteredRowData"
                :columnDefs="colDefs"
                :rowSelection="rowSelection"
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
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import userDateUtils from '@/utils/useDates.js';
import axios from "axios";
import { ajaxUrl } from "@/utils/commons.js";

export default {
  data() {
    return {
      prductNDlivyList: [], // 반제품출고 리스트
      rowData: [],
      filteredRowData: [],
      colDefs: [],

      gridOptionsReturn: {}, // AgGrid 옵션

      prductNReqName: "", // 검색 입력값
      prdlstCode: "",
      prdlstName: "",
      seCode: "",
      startDate: "",
      endDate: ""
    };
  },
  created() {
    this.getprductNDlivyList();

    this.colDefs = [
      { field: "prduct_n_req_name", headerName: "반제품요철명" },
      { field: "requst_date", headerName: "요청일자", valueFormatter: this.customDateFormat },
      { field: "prduct_n_name", headerName: "반제품명" },
      { field: "상세보기", headerName: "상세보기", cellRenderer: () => "상세보기" },
    ];

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
    async getprductNDlivyList() {
      let result = await axios.get(`${ajaxUrl}/prduct_n_dlivyList`)
        .catch(err => console.log(err));
      this.prductNDlivyList = result.data;
      this.rowData = this.prductNDlivyList;
      this.filteredRowData = this.rowData; 
    },
    // 검색버튼 클릭 = 검색값에 따른 필터링
    filterByCode() {
      this.filteredRowData = this.rowData.filter((row) => {
        let prductNDate = row.prduct_n_wrhousng_day;
        let startDate = !this.startDate || prductNDate >= this.startDate;
        let endDate = !this.endDate || prductNDate <= this.endDate;
        return (
          (!this.LOTCode || row.prduct_n_lot.includes(this.LOTCode)) &&
          (!this.prdlstCode || row.prdlst_code.includes(this.prdlstCode)) &&
          (!this.prdlstName || row.prduct_name.includes(this.prdlstName)) &&
          (!this.seCode || row.se === this.seCode) &&
          startDate && endDate
        );
      });
    },
    
    resetFilter() {
      this.LOTCode = "";
      this.prdlstCode = "";
      this.prdlstName = "";
      this.seCode = "";
      this.startDate = "";
      this.endDate = "";
      this.filteredRowData = this.rowData;
    },

    onGridReady(params) {
      this.gridOptionsReturn.api = params.api;
      this.gridOptionsReturn.columnApi = params.columnApi;
    },

    customDateFormat(params) {
      return userDateUtils.dateFormat(params.data.prduct_n_wrhousng_day, 'yyyy-MM-dd');
    }
  },
  components: {
    AgGridVue,
  },
};
</script>

<style scoped>
.ag-theme-alpine {
  height: 500px;
}

button {
  margin-right: 10px;
}
</style>
