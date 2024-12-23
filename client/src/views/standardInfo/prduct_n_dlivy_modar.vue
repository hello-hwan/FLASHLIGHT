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
                  <label for="itemCode" class="col-form-label">요청명</label>
                </div>
                <div class="col-auto">
                  <input type="text" id="itemCode" class="form-control" v-model="LOTCode" placeholder="반제품출고요청명을 입력하세요" />
                </div>
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">반제품명</label>
                </div>
                <div class="col-auto">
                  <input type="text" id="itemCode" class="form-control" v-model="prdlstCode" placeholder="반제품명을 입력하세요" />
                </div>
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">품목코드</label>
                </div>
                <div class="col-auto">
                  <input type="text" id="itemCode" class="form-control" v-model="prdlstName" placeholder="품목코드를 입력하세요" />
                </div>
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
        <v-col cols="6">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
              <span class="font-weight-black">반제품출고모달</span>
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
      prductNDlivyList: [], 
      rowData: [], 
      filteredRowData: [], 
      colDefs: [], 

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
    this.getprductNDlivyList();

    this.colDefs = [
      { field: "req_name", headerName: "요청명" },
      { field: "req_de", headerName: "요청일",
        valueFormatter: this.customDateFormat, //valueFormatter에서 함수를 설정하고 설정한 함수에서 값을 리턴함.
      },
      { field: "상세보기", headerName: "상세보기", cellRenderer: () => "상세보기" },
      // { field: "procs_at", headerName: "처리상태",
      //   valueFormatter: this.formet, // 처리상태 값 변환
      // },
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
    async getprductNDlivyList() {
      try {
        let result = await axios.get(`${ajaxUrl}/prduct_n_dlivy`);
        this.prductNDlivyList = result.data;
        this.rowData = this.prductNDlivyList; // 받아온 데이터를 rowData에 할당
        this.filteredRowData = this.rowData;  // 필터링된 데이터로 초기 설정
      } catch (err) {
        console.log("데이터 로딩 실패:", err);  // 오류 처리
      }
    },

    filterByCode() {
      // 필터링 조건이 없으면 전체 데이터 반환
      this.filteredRowData = this.rowData.filter((row) => {
        let prductNDate = row.prduct_n_wrhousng_day;

        let startDate = !this.startDate || prductNDate >= this.startDate;
        let endDate = !this.endDate || prductNDate <= this.endDate;


        return (
          (!this.LOTCode || row.req_name.includes(this.req_name)) &&
          (!this.seCode || row.req_de === this.seCode) &&
          startDate && // 시작일 비교
          endDate // 종료일 비교
        );
      });
    },
    resetFilter() {
      // 필터 초기화
      this.LOTCode = "";
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
