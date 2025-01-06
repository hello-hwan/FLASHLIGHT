<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <template v-slot:title>
              <span class="font-weight-black">완제품 입고 조회</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- 필터 검색 필드 -->
              <div class="row g-3 align-items-center">
                <!-- 반제품LOT번호 -->
                <div class="col-1">
                  <label for="itemCode" class="col-form-label">완제품LOT번호</label>
                </div>
                <div class="col-2">
                  <input type="text" id="itemCode" class="form-control" v-model="LOTCode" />
                </div>
                <!-- 품목코드 --> 
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">품목코드</label>
                </div>
                <div class="col-2">
                  <input type="text" id="itemCode" class="form-control" v-model="prdlstCode" />
                </div>
                <!-- 제품명 -->
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">제품명</label>
                </div>
                <div class="col-2">
                  <input type="text" id="itemCode" class="form-control" v-model="prdlstName"/>
                </div>
                <!-- 입고일자 -->
                <div class="col-auto">
                  <label for="startDate" class="col-form-label">입고일자</label>
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
              <span class="font-weight-black">완제품 입고 리스트</span>
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
                id="grid-one">
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
      prductWrhousngList: [], // 반제품입고완료 리스트
      rowData: [], // 반제품입고완료 데이터
      filteredRowData: [], // 검색된 데이터
      colDefs: [], // 반제품입고완료 컬럼 정의

      gridOptionsReturn: {}, // AgGrid 옵션

      LOTCode: "", // 검색 입력값
      prdlstCode: "",
      prdlstName: "",
      seCode: "",
      startDate: "",
      endDate: ""
    };
  },
  created() {
    this.getprductWrhousngList();

    this.colDefs = [
      { field: "prduct_lot", headerName: "반제품LOT" },
      { field: "prdlst_c_code", headerName: "품목코드" },
      { field: "prduct_name", headerName: "제품명" },
      { field: "wrhousng_day", headerName: "입고일자", valueFormatter: this.customDateFormat },
      { field: "prduct_invntry_qy", headerName: "재고수량" },
    ];

    this.gridOptionsReturn = {
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
        //filter: true,
        flex: 1,
        minWidth: 10,
        resizable: false,
      },
    };
  },
  methods: {
    async getprductWrhousngList() {
      let result = await axios.get(`${ajaxUrl}/prductWrhousngList`)
        .catch(err => console.log(err));
      this.prductWrhousngList = result.data;
      this.rowData = this.prductWrhousngList
      this.filteredRowData = this.rowData; // 초기 데이터 설정
    },

    filterByCode() {
      let startDate =  new Date(this.startDate).setHours(0, 0, 0, 0);
      let endDate =  new Date(this.endDate).setHours(0, 0, 0, 0);

      this.filteredRowData = this.rowData.filter((row) => {
        let prductNDate = new Date(row.wrhousng_day).setHours(0,0,0,0);
        return (
          (!this.LOTCode || row.prduct_lot.includes(this.LOTCode)) &&
          (!this.prdlstCode || row.prdlst_c_code.includes(this.prdlstCode)) &&
          (!this.prdlstName || row.prduct_name.includes(this.prdlstName)) &&
          (!startDate || prductNDate >= startDate) &&
          (!endDate || prductNDate <= endDate)
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
      return userDateUtils.dateFormat(params.data.wrhousng_day, 'yyyy-MM-dd');
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
