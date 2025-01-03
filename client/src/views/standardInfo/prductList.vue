<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <template v-slot:title>
              <span class="font-weight-black">완제품 조회</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- 필터 검색 필드 -->
              <div class="row g-3 align-items-center">
                <div class="col-1">
                  <label for="itemCode" class="col-form-label">완제품 코드</label>
                </div>
                <div class="col-3">
                  <input type="text" id="itemCode" class="form-control" v-model="prductCode" />
                </div> 
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">완제품 명</label>
                </div>
                <div class="col-3">
                  <input type="text" id="itemCode" class="form-control" v-model="prductName" />
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
              <span class="font-weight-black">완제품 등록</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <v-col cols="12" class="mb-4">
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">완제품 코드</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="prdlstCodeAdd" />
              </div>
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">완제품 명</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="prdlstNameAdd" />
              </div>
              <div class="col-auto">
                <label for="dimensions" class="col-form-label">규격</label>
              </div>
              <div class="col-auto d-flex align-items-center">
                <input type="number" id="dimensionX" class="form-control mx-1" v-model="stndrdX" placeholder="규격X" style="width: 130px;"/>
                <input type="number" id="dimensionY" class="form-control mx-1" v-model="stndrdY" placeholder="규격Y" style="width: 130px;"/>
                <input type="number" id="dimensionZ" class="form-control mx-1" v-model="stndrdZ" placeholder="규격Z" style="width: 130px;" />
              </div>
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">단위</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="unitAdd" />
              </div>
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">입고단가</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="wrhousngUntpcAdd" />
              </div>
              <div class="col-auto">
                  <label for="itemCode" class="col-form-label">출고단가</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="dlivyUntpcAdd" />
              </div>
              <!-- <div class="col-auto">
                  <label for="itemCode" class="col-form-label">총수량</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="sfinvcAdd" />
              </div> -->
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
              <span class="font-weight-black">완제품 리스트</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- AgGrid -->
              <AgGridVue
                style="height: 500px; margin: 0 auto;"
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
      prductList: [], // 완제품 리스트
      rowData: [], // 완제품 데이터
      filteredRowData: [], // 검색된 데이터
      colDefs: [], // 완제품 컬럼 정의

      mtrilInsert: [],
      rowDataInsert: [],
      colDefsInsert: [],

      gridOptionsReturn: {}, // AgGrid 옵션

      // 검색 입력값
      prductCode: "", 
      prductName: "",

    };
  },
  created() {
    this.getprductList();

    this.colDefs = [
      { field: "prdlst_code", headerName: "완제품 코드" },
      { field: "prdlst_name", headerName: "완제품 명" },
      { field: "stndrd_x", headerName: "규격x", editable: true },
      { field: "stndrd_y", headerName: "규격y", editable: true },
      { field: "stndrd_z", headerName: "규격z" , editable: true},
      { field: "unit", headerName: "단위"},
      { field: "prduct_invntry_qy", headerName: "총수량" },
      { field: "wrhousng_untpc", headerName: "입고단가" , editable: true },
      { field: "dlivy_untpc", headerName: "출고단가" , editable: true},
      { field: "sfinvc", headerName: "안전재고" , editable: true}
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
    async getprductList() {
      let result = await axios.get(`${ajaxUrl}/infoprductList`)
        .catch(err => console.log(err));
      this.prductList = result.data;
      this.rowData = this.prductList;
      this.filteredRowData = this.rowData; // 초기 데이터 설정
    },
    
    async addData(){
      let obj = {
        prdlst_code: this.prdlstCodeAdd,
        prdlst_name: this.prdlstNameAdd,
        stndrd_x: this.stndrdX,
        stndrd_y: this.stndrdY,
        stndrd_z: this.stndrdZ,
        unit: this.unitAdd,
        wrhousng_untpc: this.wrhousngUntpcAdd,
        dlivy_untpc: this.dlivyUntpcAdd,
        sfinvc: this.sfinvcAdd
      }
      let result = await axios.post(`${ajaxUrl}/prductInsert`, obj)
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
          if (data.prdlst_code) {
            axios.delete(`${ajaxUrl}/prductDelete/${data.prdlst_code}`)
              .then(() => console.log(`행 삭제 완료: ${data.prdlst_code}`))
              .catch((err) => console.error(`행 삭제 실패: ${data.prdlst_code}`, err));
          }
        });
    },

    // 검색값에 따른 필터링
    filterByCode() {
      this.filteredRowData = this.rowData.filter((row) => {
        return (
          (!this.prductCode || row.prdlst_code.includes(this.prductCode)) &&
          (!this.prductName || row.prdlst_name.includes(this.prductName))
        );
      });
    },
    
    // 검색 필터 초기화
    resetFilter() {
      this.prductCode = "";
      this.prductName = "";
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
