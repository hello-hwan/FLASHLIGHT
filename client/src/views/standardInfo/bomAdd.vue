<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <template v-slot:title>
              <span class="font-weight-black">BOM 조회</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- 필터 검색 필드 -->
              <div class="row g-3 align-items-center">
                <!-- 반제품LOT번호 -->
                <div class="col-1">
                  <label for="itemCode" class="col-form-label">BOM 코드</label>
                </div>
                <div class="col-3">
                  <input type="text" id="itemCode" class="form-control" v-model="mtrilCode" />
                </div>
                <!-- 품목코드 --> 
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">BOM명</label>
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
              <span class="font-weight-black">BOM 등록</span>
            </template>
            <v-card-text class="bg-surface-light pt-4" style="height: 595px">
              <v-col cols="12" class="mb-4">
              <div class="mb-2">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">품목코드</label>
              </div>
              <div class="mb-2">
                <input type="text" id="itemCode" class="form-control" v-model="prdlstCodeAdd" @click="modalOpen2" readonly style="height:50px"/>
              </div>
              <div class="mb-2">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">품목명</label>
              </div>
              <div class="mb-2">
                <input type="text" id="itemCode" class="form-control" v-model="prdlstNameAdd" @click="modalOpen2" readonly style="height:50px"/>
              </div>
              <div class="mb-2">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">기본생산수량</label>
              </div>
              <div class="mb-2">
                <input type="number" id="itemCode" class="form-control" v-model="sfinvcAdd" style="height:50px"/>
              </div>
              <div class="mb-3">
                <label for="remarks" class="form-label">적요</label>
                <textarea id="remarks" class="form-control" rows="3" v-model="remarks" @change="changeTest" style="height:130px; margin-bottom: 50px;"></textarea>
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
              <span class="font-weight-black">BOM 리스트</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- AgGrid -->
              <AgGridVue
                style="height: 519px; margin: 0 auto;"
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
                <!-- <button class="btn btn-primary mx-2" v-if="isModified" @click="saveChanges">수정</button> -->
                <button class="btn btn-danger" @click="deleteRow">삭제</button>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 모달 -->
    <span style="margin-left:20px; margin-bottom:0; margin-top:0;">
        <div class="modal-wrap" @click="modalOpen2" v-show="modalCheck2" >
            <div class="modal-container" @click.stop="" v-if="isModified">
                <div id="search-bar">
                    <div class="align-left"> 
                        <span>완제품 코드</span>
                        <InputText type="text" v-model="prductSearch"></InputText>
                        <span>완제품명</span>
                        <InputText type="text" v-model="prductNameSearch"> </InputText>
                        <button class="btn btn-primary mx-2" @click="prductisModified">완제품리스트</button>
                        <button class="btn btn-primary mx-2" @click="prductNisModified">반제품리스트</button>
                        <div class="d-flex justify-content-center mt-4">
                          <button @click="searchProduct"class="btn btn-primary mx-2">조회</button>
                          <button class="btn btn-secondary" @click="resetFilter">초기화</button>
                        </div>
                    </div>
                    <AgGridVue style="width: 100%; height: 460px; margin: 0 auto;"
                      :rowData="searchProductRow"
                      :columnDefs="colDefsprduct"
                      :gridOptions="gridOptions"
                      @cellClicked="onCellClicked3"
                      :rowSelection="rowSelection"
                      class="ag-theme-alpine">
                    </AgGridVue>
                </div>
    
                <div class="modal-btn d-flex justify-content-end">
                    <button @click="modalOpen2"class="btn btn-secondary">닫기</button>
                    
                </div>
            </div>
            <div class="modal-container" @click.stop="" v-if="isModified2">
                <div id="search-bar">
                    <div class="align-left"> 
                        <span>반제품 코드</span>
                        <InputText type="text" v-model="prductNSearch"></InputText>
                        <span>반제품명</span>
                        <InputText type="text" v-model="prductNNameSearch"> </InputText>
                        <button class="btn btn-primary mx-2" @click="prductisModified">완제품리스트</button>
                        <button class="btn btn-primary mx-2" @click="prductNisModified">반제품리스트</button>
                        <div class="d-flex justify-content-center mt-4">
                          <button @click="searchProductN"class="btn btn-primary mx-2" >조회</button>
                          <button class="btn btn-secondary" @click="resetNFilter">초기화</button>
                        </div>
                    </div>
                    <AgGridVue style="width: 100%; height: 460px; margin: 0 auto;"
                      :rowData="searchProductNRow"
                      :columnDefs="colDefsprductN"
                      :gridOptions="gridOptions"
                      @cellClicked="onCellClicked4"
                      :rowSelection="rowSelection"
                      class="ag-theme-alpine">
                    </AgGridVue>
                </div>
    
                <div class="modal-btn d-flex justify-content-end">
                    <button @click="modalOpen2"class="btn btn-secondary">닫기</button>
                    
                </div>
            </div>
        </div>
    </span>
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
      isModified: true, // 수정 상태 추적 변수
      isModified2: false,
      mtrilList: [], // 자재 리스트
      rowData: [], // 자재 데이터
      filteredRowData: [], // 검색된 데이터
      colDefs: [], // 자재 컬럼 정의


      prductN: [],
      rowDataprductN: [],
      colDefsprductN: [],

      searchProductRow: [],
      searchProductNRow: [],

      // 모달 검색 입력값
      prductSearch: "",
      prductNSearch: "",

      prductNameSearch: "",
      prductNNameSearch: "",

      prduct: [],
      rowDataprduct: [],
      colDefsprduct: [],

      gridOptionsReturn: {}, // AgGrid 옵션

      // 검색 입력값
      mtrilCode: "", 
      mtrilName: "",

      //input 입력값
      prdlstCodeAdd: "",
      prdlstNameAdd: "",
      sfinvcAdd: "",
      remarks: "",
      toast: useToast(),
      modalCheck2 : false,

    };
  },
  created() {
    
    this.getmtrilList();
    this.colDefs = [
      { field: "bom_code", headerName: "BOM코드" ,  flex:0.8 },
      { field: "prdlst_code", headerName: "품목코드", flex:0.8 },
      { field: "prdist_name", headerName: "품목명", flex:1.5 },
      { field: "prdctn_qy", headerName: "기본생산수량", flex:1, valueGetter: (params) => params.data.prdctn_qy || 0 , cellStyle: { textAlign: "center" } },
      { field: "sumry", headerName: "적요", flex:1 , valueGetter: (params) => params.data.sumry || "내용없음" },
    ];

    this.gridOptionsReturn = {
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
        minWidth: 10,
        resizable: false,
      },
      rowSelection: "single",
    };

    this.colDefsprductN = [
      { field: "prdlst_n_code", headerName: "반제품코드" },
      { field: "prdlst_n_name", headerName: "반제품명", width: 250 },
      { field: "선택", headerName: "선택",  cellStyle: { textAlign: "center" } , cellRenderer: () => {
                                          return '<button class="btn btn-primary mx-2">선택</button>' }}
    ];


    //this.getprduct();
    this.colDefsprduct = [
      { field: "prdlst_code", headerName: "완제품코드" },
      { field: "prdlst_name", headerName: "완제품명",width: 250 },
      { field: "선택", headerName: "선택" ,  cellStyle: { textAlign: "center" }, cellRenderer: () => {
                                          return '<button class="btn btn-primary mx-2">선택</button>' }}
    ];

    this.gridOptions = {
        defaultColDef: {
          sortable: true,
          resizable: true,
          flex: 1,
          minWidth: 10,
        },
        rowSelection: "single", // 단일 선택 가능
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

    // 모달 선택 데이터 input값 넘기기
    onCellClicked3(event){
      if(event.colDef.field === "선택"){
        this.prdlstCodeAdd = event.data.prdlst_code;
        this.prdlstNameAdd = event.data.prdlst_name;
      }
    },

    onCellClicked4(event){
      if(event.colDef.field === "선택"){
        this.prdlstCodeAdd = event.data.prdlst_n_code;
        this.prdlstNameAdd = event.data.prdlst_n_name;
      }
    },

    async modalOpen2 () {
            this.modalCheck2 = !this.modalCheck2;
            
            let listN = await axios.get(`${ajaxUrl}/prduct_n`)
                                  .catch(err => console.log(err));
            this.prductN = listN.data
            this.rowDataprductN = this.prductN
            this.searchProductNRow = this.rowDataprductN

            let list = await axios.get(`${ajaxUrl}/prduct`)
                                  .catch(err => console.log(err));
            this.prduct = list.data
            this.rowDataprduct = this.prduct
            this.searchProductRow = this.rowDataprduct
    },

    // 그리드 초기값 불러오기
    async getmtrilList() {
      let result = await axios.get(`${ajaxUrl}/bom`)
        .catch(err => console.log(err));
       // 초기 데이터 설정
      this.mtrilList = result.data;
      this.mtrilList.forEach(data => {
        if(data.sumry == null || data.sumry == undefined){
          data.sumry = '내용이없습니다';
        }
      })

      
      this.rowData = this.mtrilList;
      this.filteredRowData = this.rowData;

      console.log(this.filteredRowData);

    },

    async addData(){
      let obj = [
        this.prdlstCodeAdd,
        this.prdlstNameAdd,
        this.sfinvcAdd,
        this.remarks
      ]
      
      if(!this.prdlstCodeAdd || !this.prdlstNameAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '품목코드,품목명을 선택하세요.', life: 3000 });
      }else if(!this.sfinvcAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '기본생산수량을 입력하세요.', life: 3000 });
      }else{ 
        let result = await axios.post(`${ajaxUrl}/bomAdd`, obj)
                          .catch(err => console.log(err));
        let list = await axios.get(`${ajaxUrl}/bom`)
                          .catch(err => console.log(err));
                          this.mtrilList = list.data;
                          this.rowData = this.mtrilList;
                          this.filteredRowData = this.rowData;  
        if(result.status == 200){
          this.toast.add({ severity: 'success', summary: '성공', detail: '등록이 완료되었습니다.', life: 3000 });
        }else{
          this.toast.add({ severity: 'warn', summary: '실패', detail: '등록 중 오류가발생하엿습니다.', life: 3000 });
        }
      }

    },

    async saveChanges(){
      for(let i = 0; i < this.rowData.length; i++){
        let row = this.rowData[i];
        let obj = {
          untpc: row.untpc,
          sfinvc: row.sfinvc
        }
        // let result = await axios.put(`${ajaxUrl}/mtrilUpdate/${this.rowData[i].mtril_code}`, obj)
        //                         .catch(err => console.log(err));
        // if(result){
        //   this.toast.add({ severity: 'success', summary: '성공', detail: '수정이 완료되었습니다.', life: 3000 });
        // }
      }
    },

    deleteRow() {
        const selectedNodes = this.gridOptionsReturn.api.getSelectedNodes();

        console.log(selectedNodes);
        if (selectedNodes.length === 0) {
          this.toast.add({ severity: 'warn', summary: '경고', detail: '삭제할 행을 선택하세요.', life: 3000 });
          return;
        }

        const selectedData = selectedNodes.map((node) => node.data);

        this.rowData = this.rowData.filter(
          (row) => !selectedData.some((selected) => selected.bom_code === row.bom_code)
        );

        this.gridOptionsReturn.api.applyTransaction({ remove: selectedData });

        selectedData.forEach((data) => {
          if (data.bom_code) {
            let result = axios.delete(`${ajaxUrl}/bomDelete/${data.bom_code}`)
              .then(() => console.log(`행 삭제 완료: ${data.bom_code}`))
              .catch((err) => console.error(`행 삭제 실패: ${data.bom_code}`, err));
            if(result){
              this.toast.add({ severity: 'success', summary: '성공', detail: '삭제가 완료되었습니다.', life: 3000 });
            }else{
              this.toast.add({ severity: 'warn', summary: '경고', detail: '삭제 중 오류가 발생하엿습니다', life: 3000 });
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



    // 모달 검색값에 따른 필터링
    searchProduct(){
      this.searchProductRow = this.rowDataprduct.filter((row) => {
        return (
          (!this.prductSearch || row.prdlst_code.includes(this.prductSearch)) &&
          (!this.prductNameSearch || row.prdlst_name.includes(this.prductNameSearch)) 
        )
      })
    },

    searchProductN(){
      this.searchProductNRow = this.rowDataprductN.filter((row) => {
        return (
          (!this.prductNSearch || row.prdlst_n_code.includes(this.prductNSearch)) &&
          (!this.prductNNameSearch || row.prdlst_n_name.includes(this.prductNNameSearch)) 
        )
      })
    },
    
    // 검색 필터 초기화
    resetFilter() {
      this.prdlstCodeAdd,
      this.prdlstNameAdd,
      this.sfinvcAdd,
      this.remarks
      this.filteredRowData = this.rowData;
    },


 
    // 모달 검색 필터 초기화
    resetFilter(){
      this.prductSearch = "",
      this.prductNameSearch = "",
      this.searchProductRow = this.rowDataprduct
    },

    resetNFilter(){
      this.prductNSearch = "",
      this.prductNNameSearch = "",
      this.searchProductNRow = this.rowDataprductN
    },

    // 등록 input 초기화
    reset(){
      this.prdlstCodeAdd = "",
      this.prdlstNameAdd = "",
      this.sfinvcAdd = "",
      this.remarks = ""
    },

    onGridReady(params) {
      this.gridOptionsReturn.api = params.api;
      this.gridOptionsReturn.columnApi = params.columnApi;
    },

    prductisModified(){
      this.isModified = true;
      this.isModified2 = false;
    },

    prductNisModified(){
      this.isModified2 = true;
      this.isModified = false;
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
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 3;
}
/* modal or popup */
.modal-container {
    position: relative;
    top: 53%;
    left: 61%;
    transform: translate(-50%, -50%);
    width: 60%;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
}

.modal-btn button {
    line-height: 1.1;
    margin: 10px 0;
}
.align-left{
    margin: 10px 0;
}
.align-left>span {
    margin-left: 20px;
}
.search-btn {
    margin: 10px;
    line-height: 1.1;
}
#search-bar {
    padding: 27px;
    padding-bottom: 0px;
    background-color: #e3e3e3;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
}
.orderRowInsert{
    float: right;
}

</style>
