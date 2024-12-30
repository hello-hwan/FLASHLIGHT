<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <template v-slot:title>
              <span class="font-weight-black">거래처 조회</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- 필터 검색 필드 -->
              <div class="row g-3 align-items-center">
                <!-- 반제품LOT번호 -->
                <div class="col-1">
                  <label for="itemCode" class="col-form-label">거래처 코드</label>
                </div>
                <div class="col-3">
                  <input type="text" id="itemCode" class="form-control" v-model="bcncCode" />
                </div>
                <!-- 품목코드 --> 
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">거래처 이름</label>
                </div>
                <div class="col-3">
                  <input type="text" id="itemCode" class="form-control" v-model="mtltyName" />
                </div>
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">업태</label>
                </div>
                <div class="col-3">
                  <input type="text" id="itemCode" class="form-control" v-model="searchBizcnd" />
                </div>
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">종목</label>
                </div>
                <div class="col-3"> 
                  <input type="text" id="itemCode" class="form-control" v-model="searchItem" />
                </div>
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">담당자 명</label>
                </div>
                <div class="col-3">
                  <input type="text" id="itemCode" class="form-control" v-model="chargerName" />
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
              <span class="font-weight-black">거래처 등록</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <v-col cols="12" class="mb-4">
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">거래처 코드</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="mtrilCodeAdd" />
              </div>
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">거래처 명</label>
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
              <span class="font-weight-black">거래처 리스트</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- AgGrid -->
              <AgGridVue
                style="height: 400px; margin: 0 auto;"
                @grid-ready="onGridReady"
                @cell-value-changed="onCellValueChanged"
                :rowData="filteredRowData"
                :columnDefs="colDefs"
                :rowSelection="rowSelection"
                :gridOptions="gridOptionsReturn"
                class="ag-theme-alpine"
                id="grid-one">
              </AgGridVue>
              <div class="mt-3">
                <button class="btn btn-warning" v-if="isModified" @click="saveChanges">수정</button>
                <button class="btn btn-danger" @click="deleteRow">삭제</button>
              </div>
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
      isModified: false, // 수정 상태 추적 변수
      bcncList: [], // 거래처 리스트
      rowData: [], // 거래처 데이터
      filteredRowData: [], // 검색된 데이터
      colDefs: [], // 거래처 컬럼 정의

      mtrilInsert: [],
      rowDataInsert: [],
      colDefsInsert: [],

      gridOptionsReturn: {}, // AgGrid 옵션

      // 검색 입력값
      bcncCode: "", 
      mtltyName: "",
      searchBizcnd: "",
      searchItem: "",
      chargerName: "",
      startDate: "",
      endDate: "",

      //input 입력값
      mtrilCodeAdd: "",
      mtrilNameAdd: "",
      unitAdd: "",
      sfinvcAdd: "",
      
    };
  },
  created() {
    this.getbcncList();

    this.colDefs = [
      { field: "bcnc_code", headerName: "거래처 코드" },
      { field: "bizrno", headerName: "사업자 등록 번호" },
      { field: "mtlty_name", headerName: "거래처 명" },
      { field: "bizcnd", headerName: "업태" },
      { field: "item", headerName: "종목" },
      { field: "dvyfg_adres", headerName: "납품 주소" , editable: true},
      { field: "charger_name", headerName: "담당자 명" , editable: true},
      { field: "charger_phone", headerName: "담당자 번호" , editable: true},
      { field: "regist_day", headerName: "등록 날짜" , editable: true},
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
      rowSelection: "single",
    };
    
  },
  methods: {

    // 셀 값 변경 이벤트 핸들러
    onCellValueChanged(params) {
      // params는 변경된 셀 정보를 담고 있음
      //console.log("값 변경됨: ", params.data); // 변경된 데이터 로그 출력

      // 값이 변경되었음을 기록
      this.isModified = true;
    },

    // 그리드 초기값 불러오기
    async getbcncList() {
      let result = await axios.get(`${ajaxUrl}/bcncList`)
        .catch(err => console.log(err));
      this.bcncList = result.data;
      this.rowData = this.bcncList;
      this.filteredRowData = this.rowData; // 초기 데이터 설정
    },

    async addData(){
      let obj = {
        mtril_code: this.mtrilCodeAdd,
        mtril_name: this.mtrilNameAdd,
        unit: this.unitAdd,
        sfinvc: this.sfinvcAdd
      }
      let result = await axios.post(`${ajaxUrl}/mtrilAdd`, obj)
                        .catch(err => console.log(err));
                        this.rowData.push(obj); //등록시 그리드에 바로적용
    },

    async saveChanges(){
      for(let i = 0; i < this.rowData.length; i++){
        let row = this.rowData[i];
        let obj = {
          untpc: row.untpc,
          sfinvc: row.sfinvc
        }
        //console.log(obj);
        let result = await axios.put(`${ajaxUrl}/mtrilUpdate/${this.rowData[i].mtril_code}`, obj)
                                .catch(err => console.log(err));
      }
    },

    deleteRow() {
        const selectedNodes = this.gridOptionsReturn.api.getSelectedNodes();

        if (selectedNodes.length === 0) {
          alert("삭제할 행을 선택하세요.");
          return;
        }

        const selectedData = selectedNodes.map((node) => node.data);

        this.rowData = this.rowData.filter(
          (row) => !selectedData.some((selected) => selected.mtril_code === row.mtril_code)
        );

        this.gridOptionsReturn.api.applyTransaction({ remove: selectedData });

        selectedData.forEach((data) => {
          if (data.mtril_code) {
            axios.delete(`${ajaxUrl}/mtrilDelete/${data.mtril_code}`)
              .then(() => console.log(`행 삭제 완료: ${data.mtril_code}`))
              .catch((err) => console.error(`행 삭제 실패: ${data.mtril_code}`, err));
          }
        });
    },

    // 검색값에 따른 필터링
    filterByCode() {
      this.filteredRowData = this.rowData.filter((row) => {
        return (
          (!this.bcncCode || row.bcnc_code.includes(this.bcncCode)) &&
          (!this.mtltyName || row.mtlty_name.includes(this.mtltyName)) &&
          (!this.searchBizcnd || row.bizcnd.includes(this.searchBizcnd)) &&
          (!this.searchItem || row.item.includes(this.searchItem)) &&
          (!this.chargerName || row.charger_name.includes(this.chargerName))
        );
      });
    },
    
    // 검색 필터 초기화
    resetFilter() {
      this.bcncCode = "";
      this.mtltyName = "";
      this.searchBizcnd = "";
      this.searchItem = "";
      this.chargerName = "";
      this.startDate = "";
      this.endDate = "";
      this.filteredRowData = this.rowData;
    },

    onGridReady(params) {
      this.gridOptionsReturn.api = params.api;
      this.gridOptionsReturn.columnApi = params.columnApi;
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
