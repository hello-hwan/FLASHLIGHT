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
                  <label for="itemCode" class="col-form-label">반제품LOT번호</label>
                </div>
                <div class="col-auto">
                  <input type="text" id="itemCode" class="form-control" v-model="LOTCode" placeholder="반제품LOT번호를 입력하세요" />
                </div>
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">품목코드</label>
                </div>
                <div class="col-auto">
                  <input type="text" id="itemCode" class="form-control" v-model="prdlstCode" placeholder="품목코드를 입력하세요" />
                </div>
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">제품명</label>
                </div>
                <div class="col-auto">
                  <input type="text" id="itemCode" class="form-control" v-model="prdlstName" placeholder="품목코드를 입력하세요" />
                </div>
                <div class="col-auto">
                  <label for="searchType" class="col-form-label">구분</label>
                </div>
                <div class="col-auto">
                  <select v-model="seCode" class="form-control" id="seCode">
                    <option value="일반">일반</option>
                    <option value="반환">반환</option>
                  </select>
                </div>
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
      bomList: [], // BOM 리스트
      rowData: [], // BOM 데이터
      filteredRowData: [], // 검색된 데이터
      colDefs: [], // BOM 컬럼 정의

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
    this.getbomList();

    this.colDefs = [
      { field: "prduct_n_lot", headerName: "반제품LOT" },
      { field: "prdlst_code", headerName: "제품코드" },
      { field: "prduct_name", headerName: "제품명" },
      { field: "prduct_n_wrhousng_day", headerName: "입고일자",
        valueFormatter: this.customDateFormat, //valueFormatter에서 함수를 설정하고 설정한 함수에서 값을 리턴함.
      },
      { field: "prduct_n_invntry_qy", headerName: "재고수량" },
      { field: "se", headerName: "구분" }
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
    async getbomList() {
        let result = await axios.get(`${ajaxUrl}/prdctnNList`)
                          .catch(err => console.log(err));
        this.bomList = result.data;
        this.rowData = this.bomList;
        this.filteredRowData = this.rowData; // 초기 데이터 설정
    },

    filterByCode() {
      // 필터링 조건이 없으면 전체 데이터 반환
      this.filteredRowData = this.rowData.filter((row) => {
        let prductNDate = row.prduct_n_wrhousng_day;

        let startDate = !this.startDate || prductNDate >= this.startDate;
        let endDate = !this.endDate || prductNDate <= this.endDate;


        return (
          (!this.LOTCode || row.prduct_n_lot.includes(this.LOTCode)) &&
          (!this.prdlstCode || row.prdlst_code.includes(this.prdlstCode)) &&
          (!this.prdlstName || row.prduct_name.includes(this.prdlstName)) &&
          (!this.seCode || row.se === this.seCode) &&
          startDate && // 시작일 비교
          endDate // 종료일 비교
        );
      });
    },
    resetFilter() {
      // 필터 초기화
      this.LOTCode = "";
      this.prdlstCode = "";
      this.prdlstName = "";
      this.seCode = "";
      this.startDate = "";
      this.endDate = "";
      this.filteredRowData = this.rowData;
    },

    // 셀 클릭 시의 이벤트 핸들러 
    onCellClicked2(event) {
      console.log("선택된 셀:", event);
    },
    // 그리드 준비 완료 후 실행되는 메서드
    onGridReady(params) {
      this.gridOptionsReturn.api = params.api;
      this.gridOptionsReturn.columnApi = params.columnApi;
    },
    //날짜 yyyy-MM-dd형식에 맞춰서 가져오기
    customDateFormat(params) {
      console.log(params);
      return userDateUtils.dateFormat(params.data.prduct_n_wrhousng_day, 'yyyy-MM-dd');  //wrdate는 알레아스 이름
    }
  },
  components: {
    AgGridVue,
  },
};
</script>
