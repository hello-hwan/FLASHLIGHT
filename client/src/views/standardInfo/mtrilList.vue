<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <template v-slot:title>
              <span class="font-weight-black">자재 조회</span>
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
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px; ">
            <template v-slot:title >
              <span class="font-weight-black">자재 등록</span>
            </template>
            <v-card-text class="bg-surface-light pt-4" style="height:383px">
              <v-col cols="12" class="mb-4">
              <div class="col-auto">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">자재명</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="mtrilNameAdd" style="height:50px" />
              </div>
              <div class="col-auto">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">단위</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="unitAdd" style="height:50px" />
              </div>
              <div class="col-auto">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">안전재고</label>
              </div>
              <div class="col-auto">
                <input type="text" id="itemCode" class="form-control" v-model="sfinvcAdd"  style="height:50px; margin-bottom: 50px;"/>
              </div>
              <div class="col-12 mt-3 d-flex justify-content-end">
                <button class="btn btn-primary mx-2" @click="addData">등록</button>
                <button class="btn btn-secondary mx-2" @click="reset">초기화</button>
              </div>
              </v-col>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="8">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
              <span class="font-weight-black">자재 리스트</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- AgGrid -->
              <AgGridVue
                style="height: 309px; margin: 0 auto;"
                @grid-ready="onGridReady"
                @cell-value-changed="onCellValueChanged"
                :rowData="filteredRowData"
                :columnDefs="colDefs"
                :rowSelection="rowSelection"
                :gridOptions="gridOptionsReturn"
                overlayNoRowsTemplate="결과없음"
                class="ag-theme-alpine"
                id="grid-one">
              </AgGridVue>
              <div class="mt-3 d-flex justify-content-end">
                <button class="btn btn-primary mx-2" v-if="isModified" @click="saveChanges">수정</button>
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
import { useToast } from 'primevue/usetoast';



export default {
  data() {
    return {
      isModified: false, // 수정 상태 추적 변수
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
      mtrilNameAdd: "",
      unitAdd: "",
      sfinvcAdd: "",
      toast: useToast()

    };
  },
  created() {
    this.getmtrilList();
    this.colDefs = [
      { field: "mtril_code", headerName: "자재코드" },
      { field: "mtril_name", headerName: "자재명" },
      { field: "unit", headerName: "단위" },
      { field: "mtril_qy", headerName: "총수량", valueGetter: (params) => params.data.mtril_qy || 0 },
      { field: "untpc", headerName: "*입고단가", editable: true },
      { field: "sfinvc", headerName: "*안전재고" , editable: true}
    ];

    this.gridOptionsReturn = {
      pagination: true,
      paginationPageSize: 5,
      paginationPageSizeSelector: [5,10, 20, 50, 100],
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
    async getmtrilList() {
      let result = await axios.get(`${ajaxUrl}/mtril`)
        .catch(err => console.log(err));
      this.mtrilList = result.data;
      this.rowData = this.mtrilList;
      this.filteredRowData = this.rowData; // 초기 데이터 설정
    },

    async addData(){
      let obj = [
        this.mtrilNameAdd,
        this.unitAdd,
        this.sfinvcAdd
      ]
      
      if(!this.mtrilNameAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '자재명을 입력하세요.', life: 3000 });
      }else if(!this.unitAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '단위를 입력하세요.', life: 3000 });
      }else if(!this.sfinvcAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '안전재고를 입력하세요.', life: 3000 });
      }else{ 
        let result = await axios.post(`${ajaxUrl}/mtrilAdd`, obj)
                          .catch(err => console.log(err));
          
        let list = await axios.get(`${ajaxUrl}/mtril`)
                          .catch(err => console.log(err));
                          this.mtrilList = list.data;
                          this.rowData = this.mtrilList;
                          this.filteredRowData = this.rowData;  
        if(result){
          this.toast.add({ severity: 'success', summary: '성공', detail: '등록이 완료되었습니다.', life: 3000 });
        }else{
          this.toast.add({ severity: 'warn', summary: '실패', detail: '등록 중 오류가발생하엿습니다.', life: 3000 });
        }
      }

    },

    async saveChanges(event){
      let check = true;
      for(let i = 0; i < this.rowData.length; i++){
        let row = this.rowData[i];
        let obj = {
          untpc: row.untpc,
          sfinvc: row.sfinvc
        }
        if(this.rowData[i].untpc == null || this.rowData[i].untpc == undefined){
          this.toast.add({ severity: 'warn', summary: '업데이트 실패', detail: '입고수량을 입력하세요.', life: 3000 });
          return;
        }else if(this.rowData[i].sfinvc == null || this.rowData[i].sfinvc == undefined){
          this.toast.add({ severity: 'warn', summary: '업데이트 실패', detail: '안전재고를 입력하세요.', life: 3000 });
          return;
        }else{
          try{
            let result = await axios.put(`${ajaxUrl}/mtrilUpdate/${this.rowData[i].mtril_code}`, obj)
                                    .catch(err => console.log(err));
          }catch{
            check = false;
          }
        }
      }
      if(check){
        this.toast.add({ severity: 'success', summary: '업데이트 완료', detail: '모든 데이터가 성공적으로 업데이트되었습니다.', life: 3000 });
      }else{
        this.toast.add({ severity: 'error', summary: '업데이트 실패', detail: '데이터 업데이트 중 오류가 발생했습니다.', life: 3000 });
      }
    },

    deleteRow() {
        const selectedNodes = this.gridOptionsReturn.api.getSelectedNodes();

        if (selectedNodes.length === 0) {
          this.toast.add({ severity: 'warn', summary: '경고', detail: '삭제할 행을 선택하세요.', life: 3000 });
          return;
        }

        const selectedData = selectedNodes.map((node) => node.data);

        this.rowData = this.rowData.filter(
          (row) => !selectedData.some((selected) => selected.mtril_code === row.mtril_code)
        );

        this.gridOptionsReturn.api.applyTransaction({ remove: selectedData });

        selectedData.forEach((data) => {
          if (data.mtril_code) {
            let result = axios.delete(`${ajaxUrl}/mtrilDelete/${data.mtril_code}`)
              .then(() => console.log(`행 삭제 완료: ${data.mtril_code}`))
              .catch((err) => console.error(`행 삭제 실패: ${data.mtril_code}`, err));
              if(result.status == 200){
                this.toast.add({ severity: 'success', summary: '성공', detail: '삭제가 완료되었습니다.', life: 3000 });
              }else{
                this.toast.add({ severity: 'warn', summary: '실패', detail: '삭제 중 오류가 발생하엿습니다.', life: 3000 });
              }
          }
        });
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
