<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" class="mb-4">
        <!-- 검색 필드 -->
        <v-card class="mx-auto" style="border-radius: 13px;">
          <template v-slot:title>
                <span class="font-weight-black">반제품 출고 관리</span>
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
                <!-- 입고일자 -->
                <div class="col-1">
                  <label for="startDate" class="col-form-label">요청일</label>
                </div>
                <div class="col-2">
                  <input type="date" id="startDate" class="form-control" v-model="startDate" :max="endDate"/>
                </div>
                <div class="col-auto">
                  <label for="endDate" class="col-form-label">-</label>
                </div>
                <div class="col-2">
                  <input type="date" id="endDate" class="form-control" v-model="endDate" :min="startDate"/>
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
        <!-- 첫 번째 그리드: 출고리스트 -->
        <v-col cols="6">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
              <span class="font-weight-black">출고 요청 리스트</span>
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

        <!-- 두 번째 그리드: 출고가능제품 -->
        <v-col cols="6">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
              <span class="font-weight-black">출고 제품</span>
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
                id="grid-two">
              </AgGridVue>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 출고 버튼을 오른쪽으로 정렬 -->
    <div class="col-11 text-right">
      <button class="btn btn-primary mx-2" @click="testData">출고</button>
    </div>
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
      prductNDlivyList: [],   // 데이터 저장을 위한 배열
      rowData: [],            // 실제로 grid에 표시할 데이터
      colDefs: [],            // 컬럼 정의
      filteredRowData: [],    // 필터링 데이터
      gridOptionsReturn: {},  // grid 옵션

      prductNdlivyPossible: [],
      rowDataInfo: [],
      colDefsInfo: [],  // 출고가능제품의 컬럼 정의
      req_de: "",
      prdctn_code: "",
      req_name: "",
      obj: {},
      // 사원이름, 사원코드 임의값 
      emp_name: "이주현",
      emp_id: 200,
      // 검색 입력값
      prductNReqName: "",
      prductNName: "",
      startDate:"",
      endDate: "",
    };
  },
  created() {
    this.getprductNDlivyList(); // 컴포넌트 생성 시 데이터 불러오기

    // 출고리스트 컬럼 정의
    this.colDefs = [
      { field: "req_name", headerName: "요청명" },
      { field: "req_de", headerName: "요청일",
        valueFormatter: this.customDateFormat, // valueFormatter에서 함수를 설정하고 설정한 함수에서 값을 리턴함.
      },
      { field: "상세보기", headerName: "상세보기", cellRenderer: () => "상세보기" },
    ];

    // 출고가능제품의 컬럼 정의
    this.colDefsInfo = [
      { field: "prd_nm", headerName: "반제품제품명" },
      { field: "prd_code", headerName: "반제품제품코드" },
      { field: "lot", headerName: "반제품LOT" },
      { field: "req_qy", headerName: "요청수량" },
      { field: "lot_qy", headerName: "출고가능수량" },
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
    };
  },
  methods: {
    // 셀 클릭 시 호출되는 이벤트
    onCellClicked(event) {
      if (event.colDef.field === "상세보기") {
        const selectedprdCode = event.data.prdctn_code; 
        this.getprductNdlivyPossible(selectedprdCode); 
        console.log(selectedprdCode);
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
        console.log("데이터 로딩 실패:", err);  
      }
    },
    async getprductNdlivyPossible(prdCode) {
      console.log(prdCode)
      let result = await axios.get(`${ajaxUrl}/prduct_n_possible/${prdCode}`)
                                             .catch(err => console.log(err));
      this.prductNdlivyPossible = result.data;
      this.rowDataInfo = this.prductNdlivyPossible;
      this.obj = this.prductNdlivyPossible;
      //console.log(this.obj);
    },

    // 출고완료처리
    async testData() {

      let sendPrductNList = [];
      for(let i = 0; i < this.rowDataInfo.length; i++){
        let newObj = {...this.rowDataInfo[i], empl_no : this.emp_id};
        sendPrductNList.push(newObj);
      }
      console.log(sendPrductNList);
      let result = await axios.post(`${ajaxUrl}/prduct_n_dlivyTest`,sendPrductNList)
                              .catch(err => console.log(err));

      if(result){
        alert('출고완료');
        this.getprductNDlivyList();
        this.getprductNdlivyPossible();
      }

    },

     // 검색버튼 클릭 = 검색값에 따른 필터링
    filterByCode() {
      this.filteredRowData = this.rowData.filter((row) => {
        let reqDe = row.req_de;
        let startDate = !this.startDate || reqDe >= this.startDate;
        let endDate = !this.endDate || reqDe <= this.endDate;
        return (
          (!this.prductNReqName || row.req_name.includes(this.prductNReqName)) &&
          startDate && endDate
        );
      });
    },

    // 초기화 버튼 클릭 : 초기화 버튼 클릭시 데이터 초기값으로 초기화
    resetFilter() {
      this.prductNReqName = "";
      this.startDate = "";
      this.endDate = "";
      this.filteredRowData = this.rowData;
    },
    
    // 그리드 준비 완료 후 호출되는 메서드
    onGridReady(params) {
      this.gridOptionsReturn.api = params.api;
      this.gridOptionsReturn.columnApi = params.columnApi;
    },
    // 날짜 yyyy-MM-dd 형식에 맞춰서 가져오기
    customDateFormat(params) {
      return userDateUtils.dateFormat(params.data.req_de, 'yyyy-MM-dd');  // wrdate는 alias 이름
    }, 
    formet(params) {
      if (params.value == 'RD02') {
        return '처리중';
      }
    },
    model(){

    }
  },
  components: {
    AgGridVue, // ag-Grid 컴포넌트
  },
};
</script>
