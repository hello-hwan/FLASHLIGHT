<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <v-card-text class="bg-surface-light pt-4">
              <div class="row g-3 align-items-center">
                <!-- 품목코드 검색 필드 -->
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">품목코드</label>
                </div>
                <div class="col-auto">
                  <input type="text" id="itemCode" class="form-control" v-model="searchCode" placeholder="품목코드를 입력하세요" />
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

        <!-- 입력 폼 (품목명, 기본 생산수량) -->
        <v-col cols="12" sm="6" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <v-card-text class="bg-surface-light pt-4">
              <div class="row g-3 align-items-center">
                <div class="col-auto">
                  <label for="prdlstCode" class="col-form-label">품목코드</label>
                </div>
                <div class="col-2">
                  <input type="text" id="prdlstCode" class="form-control" v-model="prdlstCode" @change="fetchItemData" readonly />
                </div>
                <div class="col-auto">
                  <label for="prdlstName" class="col-form-label">품목명</label>
                </div>
                <div class="col-4">
                  <input type="text" id="prdlstName" class="form-control" v-model="prdlstName" readonly />
                </div>
                <div class="col-auto">
                  <label for="productionQty" class="col-form-label">생산수량</label>
                </div>
                <div class="col-2">
                  <input type="text" id="productionQty" class="form-control" v-model="productionQty" />
                </div>
              </div>
            </v-card-text>
          </v-card> 
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" class="mb-4">
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
                @cellClicked="onCellClicked"
                :gridOptions="gridOptionsReturn"
                class="ag-theme-alpine"
                id="grid-one"
              >
              </AgGridVue>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
              <span class="font-weight-black">소모품 데이터</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <AgGridVue
                style="width: 100%; height: 460px; margin: 0 auto;"
                :rowData="rowDataInfo"
                :columnDefs="colDefsInfo"
                :gridOptions="gridOptions"
                @cellClicked="onCellClicked2"
                @grid-ready="onGridReady2"
                class="ag-theme-alpine"
              >
              </AgGridVue>
              <div class="mt-3">
                <button class="btn btn-primary me-2" @click="addRow">행 추가</button>
                <button class="btn btn-danger" @click="deleteRow">행 삭제</button>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 적요 입력 폼 -->
      <div class="row mt-4">
        <div class="col-12">
          <label for="remarks" class="form-label">적요</label>
          <textarea id="remarks" class="form-control" rows="3" v-model="remarks" placeholder="적요를 입력하세요"></textarea>
        </div>
        <div class="col-12 mt-3">
          <button class="btn btn-success" @click="saveData">저장</button>
          <button class="btn btn-success" @click="update">수정</button>
        </div>
      </div>
    </v-container>
    <!-- <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal-content">
        <v-row>
          <v-col cols="12" sm="6" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px; margin-bottom: 30px;">
            <template v-slot:title>
              <span class="font-weight-black">소모품 데이터</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <AgGridVue
                style="width: 100%; height: 460px; margin: 0 auto;"
                :rowData="rowDataInfo"
                :columnDefs="colDefsInfo"
                :gridOptions="gridOptions"
                @cellClicked="onCellClicked2"
                @grid-ready="onGridReady"
                class="ag-theme-alpine"
              >
              </AgGridVue>
              <div class="mt-3">
                <button class="btn btn-primary me-2" @click="addRow">행 추가</button>
                <button class="btn btn-danger" @click="deleteRow">행 삭제</button>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        </v-row>
        <button class="btn btn-secondary" @click="closeModal">닫기</button>
      </div>
    </div> -->

    <span style="margin-left:20px; margin-bottom:0; margin-top:0;">
        <div class="modal-wrap" @click="modalOpen2" v-show="modalCheck2" >
            <div class="modal-container" @click.stop="">
                <div id="search-bar">
                    <div class="align-left"> 
                        <span>제품 코드</span>
                        <InputText type="text" ></InputText>
                        <span>제품 명</span>
                        <InputText type="text" > </InputText>
                    </div>
                    <AgGridVue
                style="width: 100%; height: 460px; margin: 0 auto;"
                :rowData="rowDataInfotest"
                :columnDefs="colDefsInfotest"
                :gridOptions="gridOptions"
                @cellClicked="onCellClicked3"
                @grid-ready="onGridReady"
                class="ag-theme-alpine"
              >
              </AgGridVue>
                    <button @click="searchProduct"class="btn btn-primary search-btn" >조회</button>
                </div>
    
                <div class="modal-btn">
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
  import bfSearchCompanyModal from '@/components/standardInfo/ModalTest.vue';
  
  import axios from "axios";
  import { ajaxUrl } from "@/utils/commons.js";
  
  export default {
    data() {
      return {
        modalCheck2 : false,
        isModalVisible: false, // 모달 표시 여부
        selectedCmpdsCode: null, // 선택된 소모품 코드 데이터
        bomList: [], // BOM 리스트
        rowData: [], // BOM 데이터
        filteredRowData: [], // 검색된 데이터
        colDefs: [], // BOM 컬럼 정의
  
        bomListInfo: [], // 상세보기 리스트
        rowDataInfo: [], // 상세보기 데이터
        colDefsInfo: [], // 상세보기 컬럼 정의
  
        bomInfoList: [],
        rowDataInfotest: [],
        colDefsInfotest: [],

        gridOptionsReturn: {}, // AgGrid 옵션
  
        searchCode: "", // 검색 입력값
        prdlstCode: this.prdlst_code,
        prdlstName: this.prdist_name, 
        productionQty: "",
        remarks: "", 
        rowCount: 0,
        trueRowCount: 0,
      };
    },
    created() {
      this.getbomList();
  
      // BOM 조회 컬럼 정의
      this.colDefs = [
        { field: "bom_code", headerName: "BOM코드" },
        { field: "prdlst_code", headerName: "제품코드" },
        { field: "prdist_name", headerName: "제품명" },
        { field: "prdctn_qy", headerName: "기본생산수량" },
        { field: "상세보기", headerName: "상세보기", cellRenderer: () => "상세보기" },
      ];
  
      // 상세보기 컬럼 정의
      this.colDefsInfo = [
        { field: "cmpds_prdlst_code", headerName: "소모품목코드", editable: (params) => params.node.data.isNewRow },
        { field: "cmpds_prdlst_name", headerName: "소모품명", editable: (params) => params.node.data.isNewRow },
        { field: "stndrd_x", headerName: "규격x", editable: (params) => params.node.data.stndrd_x == null },
        { field: "stndrd_y", headerName: "규격y", editable: (params) => params.node.data.stndrd_y == null },
        { field: "stndrd_z", headerName: "규격z", editable: (params) => params.node.data.stndrd_z == null },
        { field: "unit", headerName: "단위", editable: (params) => params.node.data.isNewRow },
        { field: "cnsum_count", headerName: "소모량", editable: true }, // 항상 수정 가능        
      ];
      
      // 모달 컬럼저의
      this.colDefsInfotest = [
        { field: "mtril_code", headerName: "자재코드" },
        { field: "mtril_name", headerName: "자재명" },
        { field: "unit", headerName: "단위" },
        { field: "untpc", headerName: "입고단가" },
        { field: "sfinvc", headerName: "안전재고" },
        { field: "선택", headerName: "선택", cellRenderer:() => '선택'}
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
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 10,
      },
      rowSelection: "single", 
    }; 
    },
    components: {
      AgGridVue,
      bfSearchCompanyModal
    },
    methods: {
      async modalOpen2 () {
            this.modalCheck2 = !this.modalCheck2;
            let result = await axios.get(`${ajaxUrl}/bomMtilList`)
                              .catch(err => console.log(err));
            this.bomInfoList = result.data
                              this.rowDataInfotest = this.bomInfoList
                // //행 데이터 초기화
                // this.rowData2 = [];
    
                // //검색조건 초기화
                // this.searchProductCode = null;
                // this.searchProductName = null;
        },

      //  // 모달 열기
      // openModal(cmpdsCode) {
      //   this.isModalVisible = true;
      //   this.selectedCmpdsCode = cmpdsCode;

      //   // 모달 창 크기 자동 조정
      //   const modalContent = this.$refs.modalContent;
      //   const windowHeight = window.innerHeight;
      //   modalContent.style.maxHeight = `${windowHeight - 100}px`; // 여백을 고려해 높이 설정
      // },

      // // 모달 닫기
      // closeModal() {
      //   this.isModalVisible = false;
      //   this.selectedCmpdsCode = null;
      // },

      onCellClicked(event) {
        if (event.colDef.field === "상세보기") {
          this.selectedBomCode = event.data.prdlst_code; // 상세보기를 위한 데이터 추츨
          this.getbomListInfo(this.selectedBomCode); // 상세 정보 조회
          this.remarks = event.data.sumry;
        }
      },
      // BOM 정보 SELECT 및 그리드 데이터 삽입
      async getbomList() {
        let result = await axios.get(`${ajaxUrl}/bom`)
                          .catch(err => console.log(err));
        this.bomList = result.data;
        this.rowData = this.bomList;
        this.filteredRowData = this.rowData; // 초기 데이터 설정
      },

      // BOM 코드를 기반으로 조건SELECT 후 소모품 그리드에 데이터 삽입
      async getbomListInfo(bomCode) {
        let result = await axios.get(`${ajaxUrl}/bomManage/${bomCode}`)
                                  .catch(err => console.log(err));
        console.log(result.data);
        this.bomListInfo = result.data;
        console.log(this.bomListInfo);
        this.rowDataInfo = this.bomListInfo;
        if (result) {
          this.prdlstCode = result.data[0].prdlst_code;
          this.prdlstName = result.data[0].prdist_name;
          this.productionQty = result.data[0].prdctn_qy;
          this.rowData = result.data;
          this.rowCount = this.rowData.length;
          this.trueRowCount = this.rowData.length;
        }
      },

      // 검색조건값에 따른 필터링
      filterByCode() {
        this.filteredRowData = this.rowData.filter((row) =>
          row.prdlst_code.includes(this.searchCode)
        );
      },

      // 검색조건 초기화
      resetFilter() {
        this.searchCode = "";
        this.filteredRowData = [...this.bomList];
      },

      // 행추가
      addRow() {
        const newRow = {
          cmpds_no: "",
          cmpds_prdlst_code: "",
          cmpds_prdlst_name: "",
          stndrd_x: "",
          stndrd_y: "",
          stndrd_z: "",
          unit: "",
          cnsum_count: "",
          isNewRow: true, // 새로 추가된 행임을 나타냄(새로추가된 행을 구분하여 전체 입력가능하도록하기위함)
        };
        this.rowDataInfo = [...this.rowDataInfo, newRow];
        // 데이터 반영을 위해 Vue 데이터 갱신
        console.log('행추가시 길이',this.rowDataInfo.length);
        if (this.gridOptions.api) {
          this.gridOptions.api.setRowData(this.rowDataInfo);
        }
      },
      deleteRow() {
        const selectedNodes = this.gridOptions.api.getSelectedNodes();
        console.log(selectedNodes);
        if (selectedNodes.length === 0) {
          alert("삭제할 행을 선택하세요.");
          return;
        }

        const selectedData = selectedNodes.map((node) => node.data);

        this.rowDataInfo = this.rowDataInfo.filter(
          (row) => !selectedData.some((selected) => selected.cmpds_no === row.cmpds_no)
        );

        this.gridOptions.api.applyTransaction({ remove: selectedData });

        selectedData.forEach((data) => {
          if (data.cmpds_no) {
            axios.delete(`${ajaxUrl}/bom_cmpdsDel/${data.cmpds_no}`)
              .then(() => console.log(`행 삭제 완료: ${data.cmpds_no}`))
              .catch((err) => console.error(`행 삭제 실패: ${data.cmpds_no}`, err));
          }
        });
      },
      async saveData() { 
        for(let i = this.rowCount; i < this.rowDataInfo.length; i ++) {
          let row = this.rowDataInfo[i];
          let obj = {
            cmpds_no: row.cmpds_no,
            bom_code: this.rowData[0].bom_code,
            cmpds_prdlst_code: row.cmpds_prdlst_code,
            cmpds_prdlst_name: row.cmpds_prdlst_name, 
            stndrd_x: row.stndrd_x,
            stndrd_y: row.stndrd_y,
            stndrd_z: row.stndrd_z,
            unit: row.unit,
            cnsum_count: row.cnsum_count,
          }
          console.log(obj);
          let result = await axios.post(`${ajaxUrl}/bom`, obj)
                                  .catch(err => console.log(err));           
        }
        // 저장 후 플래그 제거
        this.rowDataInfo = this.rowDataInfo.map((row) => {
          if (row.isNewRow) delete row.isNewRow;
          return row;
        });

        // 데이터 갱신
        if (this.gridOptions.api) {
          this.gridOptions.api.setRowData(this.rowDataInfo);
        }
      },
      async update() {
        for(let i = 0; i < this.rowData.length; i ++) {
          let row = this.rowData[i];
          let obj = {
            cnsum_count: row.cnsum_count
          }
          let result = await axios.put(`${ajaxUrl}/bom_cmpsdUpdate/${this.rowData[i].cmpds_no}`,obj)
                                        .catch(err => console.log(err));
        }
      },
      onCellClicked2(event) {
        if (event.colDef.field === "cmpds_prdlst_code") {
          this.modalOpen2(); // 소모품 코드 클릭 시 모달 열기
        }
      },

      onCellClicked3(event){
        console.log('event',event);
        console.log('test',event.rowIndex);
        console.log('rowDataInfo',this.rowDataInfo);
        console.log('rowDataInfo length', this.rowDataInfo.length);
        if(event.colDef.field === "선택"){
          let obj = {
            cmpds_prdlst_code:  event.data.mtril_code,
            cmpds_prdlst_name:  event.data.mtril_name,
            unit: event.data.unit
          }
          this.rowDataInfo.splice(event.rowIndex,this.rowDataInfo.length,obj);
          // 값이 들어간 행 변경 방지
          // if(this.rowDataInfo.length > this.rowCount){   
          //   if(this.rowDataInfo.length == this.trueRowCount + 1 ){
          //     this.rowDataInfo.pop();
          //     this.rowDataInfo.push(obj);
          //     this.rowCount = this.rowDataInfo.length; 
          //   }else{
          //     this.rowDataInfo.splice(this.trueRowCount + 1 , 0, obj);
          //     this.trueRowCount + 1;
          //   }     
            
          // }
        }
      },

      onGridReady(params) {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
      },
      onGridReady2(params) {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
      },
    },
    
  };
</script> 
<style>
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

/* 모달 스타일 */
/* .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 80%;
  max-width: 800px; 
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: auto;
}


.ag-theme-alpine {
  height: 400px; 
  width: 100%; 
} */
</style>