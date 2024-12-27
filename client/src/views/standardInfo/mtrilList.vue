<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <template v-slot:title>
              <span class="font-weight-black">자재조회</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- 필터 검색 필드 -->
              <div class="row g-3 align-items-center">
                <!-- 반제품LOT번호 -->
                <div class="col-1">
                  <label for="itemCode" class="col-form-label">자재코드</label>
                </div>
                <div class="col-3">
                  <input type="text" id="itemCode" class="form-control" v-model="mtrilCode" />
                </div>
                <!-- 품목코드 --> 
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">자재명</label>
                </div>
                <div class="col-3">
                  <input type="text" id="itemCode" class="form-control" v-model="mtrilName" />
                </div>
                <div class="col-3">
                  <button class="btn btn-primary mx-2" @click="filterByCode">검색</button>
                  <button class="btn btn-secondary mx-2" @click="resetFilter">초기화</button>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>



      <v-row>
        <v-col cols="4">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
              <span class="font-weight-black">완제품 입고 리스트</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- AgGrid -->
              <!-- <AgGridVue
                style="height: 400px; margin: 0 auto;"
                @grid-ready="onGridReady"
                :rowData="rowDataInsert"
                :columnDefs="colDefsInsert"
                :gridOptions="gridOptions"
                class="ag-theme-alpine"
                id="grid-one">
              </AgGridVue> -->
              <v-col cols="12" class="mb-4">
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">자재코드</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="mtrilCodeAdd" />
              </div>
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">자재명</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="mtrilNameAdd" />
              </div>
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">단위</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="unitAdd" />
              </div>
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">안전재고</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="sfinvcAdd" />
              </div>
              <div class="col-12 mt-3">
                <button class="btn btn-success" @click="addData">등록</button>
                <button class="btn btn-success" @click="reset">초기화</button>
              </div>
              </v-col>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="8">
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
import axios from "axios";
import { ajaxUrl } from "@/utils/commons.js";

export default {
  data() {
    return {
      mtrilList: [], // 자재 리스트
      rowData: [], // 자재 데이터
      filteredRowData: [], // 검색된 데이터
      colDefs: [], // 자재 컬럼 정의

      mtrilInsert: [],
      rowDataInsert: [],
      colDefsInsert: [],

      gridOptionsReturn: {}, // AgGrid 옵션

      // 검색 입력값
      mtrilCode: "", 
      mtrilName: "",

      //input 입력값
      mtrilCodeAdd: "",
      mtrilNameAdd: "",
      unitAdd: "",
      sfinvcAdd: "",
    };
  },
  created() {
    this.getmtrilList();

    this.colDefs = [
      { field: "mtril_code", headerName: "자재코드" },
      { field: "mtril_name", headerName: "자재명" },
      { field: "unit", headerName: "단위" },
      { field: "untpc", headerName: "입고단가" },
      { field: "sfinvc", headerName: "안전재고" },
    ];

    this.gridOptionsReturn = {
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
        filter: true,
        flex: 1,
        minWidth: 10
      },
    };

    this.colDefsInsert = [
      { field: "자재코드", headerName: "자재코드" },
      { field: "자재명", headerName: "자재명" },
      { field: "단위", headerName: "단위" },
      { field: "입고단가", headerName: "입고단가" },
      { field: "안전재고", headerName: "안전재고" },
    ];
    this.gridOptions = {
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
        filter: true,
        flex: 1,
        minWidth: 10,
        editable: true,
      },
      rowSelection: "single",
    };
    
  },
  methods: {
    // 그리드 초기값 불러오기
    async getmtrilList() {
      let result = await axios.get(`${ajaxUrl}/mtril`)
        .catch(err => console.log(err));
      this.mtrilList = result.data;
      this.rowData = this.mtrilList;
      this.filteredRowData = this.rowData; // 초기 데이터 설정
    },

    addData(){
      let obj = {
        mtrilCode: this.mtrilCodeAdd,
        mtrilName: this.mtrilNameAdd,
        unit: this.unitAdd,
        sfinvc: this.sfinvcAdd
      }
    },

    // 검색값에 따른 필터링
    filterByCode() {
      this.filteredRowData = this.rowData.filter((row) => {
        return (
          (!this.mtrilCode || row.mtril_code.includes(this.mtrilCode)) &&
          (!this.mtrilName || row.mtril_name.includes(this.mtrilName))
        );
      });
    },
    
    // 검색 필터 초기화
    resetFilter() {
      this.mtrilCode = "";
      this.mtrilName = "";
      this.filteredRowData = this.rowData;
    },

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
.ag-theme-alpine {
  height: 500px;
}

button {
  margin-right: 10px;
}
</style>
