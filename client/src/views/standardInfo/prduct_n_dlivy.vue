<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="6">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <div class="col-1">
              <button type="button" class="btn btn-primary" @click="">조회</button>
            </div>
            <template v-slot:title>
              <span class="font-weight-black">출고리스트</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <AgGridVue
                style="height: 500px; margin: 0 auto;"
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
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
              <span class="font-weight-black">출고가능제품</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <AgGridVue
                style="height: 500px; margin: 0 auto;"
                @grid-ready="onGridReady"
                :rowData="rowDataInfo"
                :columnDefs="colDefsInfo"
                :rowSelection="rowSelection"
                @cellClicked="onCellClicked"
                :gridOptions="gridOptions"
                class="ag-theme-alpine"
                id="grid-one">
              </AgGridVue>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div class="col-10">
    <button type="button" class="btn btn-primary" @click="testData">출고</button>
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
      prductNDlivyList: [],  // 데이터 저장을 위한 배열
      rowData: [],            // 실제로 grid에 표시할 데이터
      colDefs: [],            // 컬럼 정의

      gridOptionsReturn: {},  // grid 옵션

      prductNdlivyPossible: [],
      rowDataInfo: [],
      colDefs: [],
      req_de: "",
      req_code: "",
      req_name: "",
      obj: { 
            prdlst_code: "",
            prduct_n_invntry_qy: "",
            prduct_n_lot: "",
            prduct_name: "",
            req_qy: "",
            req_de: "",
            req_code: "",
            req_name: ""
      }
    };
  },
  created() {
    this.getprductNDlivyList(); // 컴포넌트 생성 시 데이터 불러오기

    // 출고리스트 컬럼 정의
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
    this.colDefsInfo = [
      {field: "prduct_name", headerName: "반제품제품명" },
      {field: "prdlst_code", headerName: "반제품제품코드" },
      {field: "prduct_n_lot", headerName: "반제품LOT" },
      {field: "req_qy", headerName: "요청수량" },
      {field: "prduct_n_invntry_qy", headerName: "출고가능수량" },
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
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
        flex: 1,
        minWidth: 10,
      },
    }
  },
  methods: {
    // 셀 클릭 시 호출되는 이벤트
    onCellClicked(event) {
      if(event.colDef.field === "상세보기"){
        const selectedprdCode = event.data.prd_code; // 선택된 BOM 코드 추출
        console.log(selectedprdCode.length);
        console.log(`선택된 품목 코드: ${selectedprdCode}`);
        console.log('요청코드:',event.data.req_code);
        this.getprductNdlivyPossible(selectedprdCode); // BOM 상세 정보 조회
        console.log(event.data);
        this.req_de = event.data.req_de;
        this.req_code = event.data.req_code;
        this.req_name = event.data.req_name;

      }
    },

    // 제품 리스트 가져오기
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
    async getprductNdlivyPossible(prdCode){
      let result = await axios.get(`${ajaxUrl}/prduct_n_possible/${prdCode}`)
                              .catch(err => console.log(err));
      this.prductNdlivyPossible = result.data;
      this.rowDataInfo = this.prductNdlivyPossible;
      this.obj = this.prductNdlivyPossible;
    },
    testData(){

      // rowDataInfo를 순회하면서 각 항목에 req_code를 추가한 새로운 배열 생성
      this.obj = this.rowDataInfo.map((row) => {
        return {
          ...row,
          req_code: this.req_code, 
          req_de: this.req_de,
          req_name: this.req_name
        };
      });
        console.log(this.obj); 
        // 반제품 출고 프로시저호출 메소드 만들어야됨
    },
    // 그리드 준비 완료 후 호출되는 메서드
    onGridReady(params) {
      this.gridOptionsReturn.api = params.api;
      this.gridOptionsReturn.columnApi = params.columnApi;
    },
    //날짜 yyyy-MM-dd형식에 맞춰서 가져오기
    customDateFormat(params) {
      return userDateUtils.dateFormat(params.data.req_de, 'yyyy-MM-dd');  //wrdate는 알레아스 이름
    }, 
    formet(params){
      if(params.value == 'RD02'){
        return '처리중';
      }
    }
  },
  components: {
    AgGridVue, // ag-Grid 컴포넌트
  },
};
</script>
