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
        <v-col cols="12" sm="6" class="mb-4" >
          <v-card class="mx-auto" style="border-radius: 13px;">
            <v-card-text class="bg-surface-light pt-4">
              <div class="row g-3 align-items-center">
                <div class="col-auto">
                  <label for="prdlstCode" class="col-form-label">품목코드</label>
                </div>
                <div class="col-2">
                  <input type="text" id="prdlstCode" class="form-control" v-model="prdlstCode" @change="fetchItemData" readonly  />
                </div>
                <div class="col-auto">
                  <label for="prdlstName" class="col-form-label">품목명</label>
                </div>
                <div class="col-5">
                  <input type="text" id="prdlstName" class="form-control" v-model="prdlstName" readonly />
                </div>
                <div class="col-auto">
                  <label for="productionQty" class="col-form-label">생산수량</label>
                </div>
                <div class="col-1" v-if="istest">
                  <input type="text" id="productionQty" class="form-control editable-input" v-model="productionQty" @change="changeTest"  style="width: 70px; text-align:center"/>
                </div>
              </div>
            </v-card-text>
          </v-card> 
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <template v-slot:title>
              <span class="font-weight-black">BOM조회</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <AgGridVue
                style="height: 310px; margin: 0 auto;"
                @grid-ready="onGridReady"
                :rowData="filteredRowData"
                :columnDefs="colDefs"
                :rowSelection="rowSelection"
                @cellClicked="onCellClicked"
                :gridOptions="gridOptionsReturn"
                overlayNoRowsTemplate="결과없음"
                class="ag-theme-alpine"
                id="grid-one">
              </AgGridVue>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" class="mb-4">
          <v-card class="mx-auto" style="border-radius: 13px; ">
            <template v-slot:title>
              <span class="font-weight-black">BOM 소모품</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <AgGridVue
                style="width: 100%; height: 270px; margin: 0 auto;"
                :rowData="rowDataInfo"
                :columnDefs="colDefsInfo"
                :gridOptions="gridOptions"
                :rowSelection="rowSelection"
                @cellClicked="onCellClicked2"
                @grid-ready="onGridReady2"
                @cell-value-changed="onCellValueChanged"
                overlayNoRowsTemplate="결과없음"
                class="ag-theme-alpine">
              </AgGridVue>
              <div class="mt-3 d-flex justify-content-end">
                <button class="btn btn-primary me-2" @click="modalOpen2">소모품 추가</button>
                <button class="btn btn-danger me-2" @click="deleteRow">소모품 삭제</button>
                <button class="btn btn-warning" v-if="isModified" @click="update">수정</button>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 적요 입력 폼 -->
      <div class="row mt-4">
        <div class="col-12" v-if="istest">
          <label for="remarks" class="form-label">적요</label>
          <textarea id="remarks" class="form-control" rows="3" v-model="remarks" @change="changeTest" ></textarea>
        </div>
      </div>
      <div class="col-12 mt-3" style="text-align: right">
            <button class="btn btn-primary search-btn" v-bind:disabled="isButtonDisabled" @click="saveData">저장</button>
      </div>
    </v-container>

    <span style="margin-left:20px; margin-bottom:0; margin-top:0;">
        <div class="modal-wrap" @click="modalOpen2" v-show="modalCheck2" >
            <div class="modal-container" @click.stop="" v-if="mtrilModal">
                <div id="search-bar">
                    <div class="align-left"> 
                        <span>자재 코드</span>
                        <InputText type="text" v-model="mtrilCodeInput"></InputText>
                        <span>자재 명</span>
                        <InputText type="text" v-model="mtrilNameInput"> </InputText>
                        <button @click="mtrilModalOpen"class="btn btn-primary search-btn" >자재</button>
                        <button @click="prdlstNModalOpen"class="btn btn-primary search-btn" >반제품</button>
                        <div class="d-flex justify-content-center mt-4">
                          <button @click="searchMtril"class="btn btn-primary mx-2" >조회</button>
                          <button class="btn btn-secondary" @click="resetModal">초기화</button>
                        </div>
                    </div>
                    <AgGridVue style="width: 100%; height: 460px; margin: 0 auto;"
                      :rowData="mtrilFilter"
                      :columnDefs="colDefsInfotest"
                      :gridOptions="gridOptions2"
                      @cellClicked="onCellClicked3"
                      @grid-ready="onGridReady"
                      overlayNoRowsTemplate="결과없음"
                      class="ag-theme-alpine">
                    </AgGridVue>
                </div>
    
                <div class="modal-btn d-flex justify-content-end">
                    <button @click="modalOpen2"class="btn btn-secondary">닫기</button>
                </div>
            </div>

            <div class="modal-container" @click.stop="" v-if="prdlstNModal">
                <div id="search-bar">
                    <div class="align-left"> 
                        <span>반제품 코드</span>
                        <InputText type="text" v-model="prdlstCodeInput"></InputText>
                        <span>반제품 명</span>
                        <InputText type="text" v-model="prdlstNameInput"> </InputText>
                        <button @click="mtrilModalOpen"class="btn btn-primary search-btn" >자재</button>
                        <button @click="prdlstNModalOpen"class="btn btn-primary search-btn" >반제품</button>
                        <div class="d-flex justify-content-center mt-4">
                          <button @click="searchPrductN"class="btn btn-primary mx-2" >조회</button>
                          <button class="btn btn-secondary" @click="resetModal">초기화</button>
                        </div>
                    </div>
                    <AgGridVue style="width: 100%; height: 460px; margin: 0 auto;"
                      :rowData="prductNFilter"
                      :columnDefs="colDefsInfoModal"
                      :gridOptions="gridOptions2"
                      @cellClicked="onCellClicked3"
                      @grid-ready="onGridReady"
                      overlayNoRowsTemplate="결과없음"
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
import bfSearchCompanyModal from '@/components/standardInfo/ModalTest.vue';
  
import axios from "axios";
import { ajaxUrl } from "@/utils/commons.js";
import { useToast } from 'primevue/usetoast';

  export default {
    data() {
      return {
        mtrilModal: true,
        prdlstNModal: false,
        istest: false,
        isButtonDisabled : true,
        isModified: false, // 수정 상태 추적 변수
        modalCheck2 : false,
        //isModalVisible: false, // 모달 표시 여부
        selectedCmpdsCode: null, // 선택된 소모품 코드 데이터
        bomList: [], // BOM 리스트
        rowData: [], // BOM 데이터
        filteredRowData: [], // 검색된 데이터
        colDefs: [], // BOM 컬럼 정의
  
        bomListInfo: [], // 상세보기 리스트
        rowDataInfo: [], // 상세보기 데이터
        colDefsInfo: [], // 상세보기 컬럼 정의
  
        // 모달 자재 조회 데이터
        bomInfoList: [],
        rowDataInfotest: [],
        colDefsInfotest: [],
        mtrilFilter: [],

        // 모달 반제품 조회 데이터
        prductNModel: [], 
        rowDataInfoModal: [],
        colDefsInfoModal: [],
        prductNFilter: [],

        gridOptionsReturn: {}, // AgGrid 옵션
  
        searchCode: "", // 검색 입력값
        prdlstCode: "",
        prdlstName: "", 
        productionQty: "",
        remarks: "", 
        rowCount: 0,
        isNewRow: true,
        toast : useToast(),
        bomCode: "",

        // 자재검색 입력값
        mtrilCodeInput: "",
        mtrilNameInput: "",

        // 반제품 검색 입력값
        prdlstCodeInput: "",
        prdlstNameInput: "",

        // 클릭이벤트 값 저장변수
        code: "",
        cnsumCount: "",
        cmpdsCode: ""

      };

    },
    created() {
      this.getbomList();
  
      // BOM 조회 컬럼 정의
      this.colDefs = [
        { field: "bom_code", headerName: "BOM코드", flex:0.8 },
        { field: "prdlst_code", headerName: "제품코드" , flex:0.7},
        { field: "prdist_name", headerName: "제품명" , flex:2},
        { field: "prdctn_qy", headerName: "기본생산수량" , flex:0.9 ,cellStyle: { textAlign: "center" }},
        { field: "상세보기", headerName: "상세보기", flex:1, cellStyle: { textAlign: "center" } ,cellRenderer: () => {
                                                  return '<button class="btn btn-primary mx-2">상세보기</button>'}},
      ];
  
      // 상세보기 컬럼 정의
      this.colDefsInfo = [
        { field: "cmpds_prdlst_code", headerName: "소모품목코드", flex:0.8 , valueGetter: (params) => params.data.cmpds_prdlst_code || params.data.prdlst_code},
        { field: "cmpds_prdlst_name", headerName: "소모품명", flex:1.5},
        // { field: "stndrd_x", headerName: "규격x", editable: (params) => params.node.data.stndrd_x == null },
        // { field: "stndrd_y", headerName: "규격y", editable: (params) => params.node.data.stndrd_y == null },
        // { field: "stndrd_z", headerName: "규격z", editable: (params) => params.node.data.stndrd_z == null },
        { field: "unit", headerName: "단위", flex:1 },
        { field: "cnsum_count", headerName: "소모량", flex:1, editable: true }, // 항상 수정 가능        
      ];
      
      // 자재 모달 컬럼정의
      this.colDefsInfotest = [
        { field: "mtril_code", headerName: "자재코드" },
        { field: "mtril_name", headerName: "자재명" },
        { field: "unit", headerName: "단위" },
        { field: "untpc", headerName: "입고단가" },
        { field: "sfinvc", headerName: "안전재고" },
        { field: "선택", headerName: "선택", cellStyle: { textAlign: "center" } ,cellRenderer: () => {
                                            return '<button class="btn btn-primary mx-2">선택</button>'}}
      ];

      // 반제품 모달 컬럼 정의
      this.colDefsInfoModal = [
        { field: "prdlst_code", headerName: "반제품코드", flex:0.8 },
        { field: "prdlst_name", headerName: "반제품명", flex:1.5 },
        { field: "unit", headerName: "단위", flex:1 },
        { field: "wrhousng_unite", headerName: "입고단가" , flex:1},
        { field: "sfinvc", headerName: "안전재고", flex:1 },
        { field: "선택", headerName: "선택", flex:1, cellStyle: { textAlign: "center" } ,cellRenderer: () => {
                                            return '<button class="btn btn-primary mx-2">선택</button>'}}
      ];
    
      // AgGrid 기본 옵션 설정
      this.gridOptionsReturn = {
        pagination: true,
        paginationPageSize: 5,
        paginationPageSizeSelector: [5,10, 20, 50, 100],
        animateRows: false,
        defaultColDef: {
          flex: 1,
          minWidth: 10,
        },
      };
      this.gridOptions = {
        defaultColDef: {
          sortable: true,
          resizable: true,
          flex: 1,
          minWidth: 10,
        },
        rowSelection: "single", // 단일 선택 가능
      };
      this.gridOptions2 = {
        defaultColDef: {
          sortable: true,
          resizable: true,
          flex: 1,
          minWidth: 10,
        },
        rowSelection: "single", // 단일 선택 가능
      };
    },
    components: {
      AgGridVue,
      bfSearchCompanyModal
    },
    methods: {
      // 생산수량, 적요 변경에따른 버튼 활성화
      changeTest(){
        this.isButtonDisabled = false;
      },

      onCellValueChanged(params) {
        // 추가된 행인지 확인
        if (params.data.isNewRow) {
          //console.log("추가된 행의 값 변화는 감지하지 않습니다:", params.data);
          return;
        }
        
        // 기존 행의 값 변경 처리
        //console.log("값 변경됨: ", params.data);
        this.isModified = true;
      },

      async modalOpen2 () {
            this.modalCheck2 = !this.modalCheck2;
            let result = await axios.get(`${ajaxUrl}/bomMtilList`)
                              .catch(err => console.log(err));
            this.bomInfoList = result.data
            this.rowDataInfotest = this.bomInfoList;
            this.mtrilFilter = this.rowDataInfotest;

            let prdlstN = await axios.get(`${ajaxUrl}/prductNModel`)
                                      .catch(err => console.log(err));
              this.prductNModel = prdlstN.data;
              this.rowDataInfoModal = this.prductNModel;
              this.prductNFilter = this.rowDataInfoModal;
                // //행 데이터 초기화
                // this.rowData2 = [];
    
                // //검색조건 초기화
                // this.searchProductCode = null;
                // this.searchProductName = null;
        },
    
      onCellClicked(event) {
        if (event.colDef.field === "상세보기") {
          this.istest = true;
          this.bomCode = event.data.bom_code;
          this.prdlstCode = event.data.prdlst_code;
          this.prdlstName = event.data.prdist_name;
          this.productionQty = event.data.prdctn_qy;
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
        //console.log(this.rowData);
      },

      // BOM 코드를 기반으로 조건SELECT 후 소모품 그리드에 데이터 삽입
      async getbomListInfo(bomCode) {
        let result = await axios.get(`${ajaxUrl}/bomManage/${bomCode}`)
                                  .catch(err => console.log(err));
        //console.log(result.data);
        this.bomListInfo = result.data;
        this.rowDataInfo = this.bomListInfo;
        if (result) {
          this.rowData = result.data;
          this.rowCount = this.rowData.length;
          this.trueRowCount = this.rowData.length;
        }
        //console.log(this.productionQty);
      },

      // 검색조건값에 따른 필터링
      filterByCode() {
        this.filteredRowData = this.rowData.filter((row) =>
          row.prdlst_code.includes(this.searchCode)
        );
      },

      // 자재모달 검색 필터링
      searchMtril(){
        this.mtrilFilter = this.rowDataInfotest.filter((row) => {
          return (
            (!this.mtrilCodeInput || row.mtril_code.includes(this.mtrilCodeInput)) &&
            (!this.mtrilNameInput || row.mtril_name.includes(this.mtrilNameInput))
          );
        })
      },

      // 반제품 모달 검색 필터링
      searchPrductN(){
        this.prductNFilter = this.rowDataInfoModal.filter((row) => {
          return (
            (!this.prdlstCodeInput || row.prdlst_code.includes(this.prdlstCodeInput)) &&
            (!this.prdlstNameInput || row.prdlst_name.includes(this.prdlstNameInput))
          );
        })
      },

      // 검색조건 초기화
      resetFilter() {
        this.searchCode = "";
        this.filteredRowData = [...this.bomList];
      },

      // 모달 검색 조건 초기화
      resetModal(){
        console.log('클릭테스트')
        this.prdlstCodeInput = "";
        this.prdlstNameInput = "";
        this.mtrilCodeInput = "";
        this.mtrilNameInput = "";

        this.mtrilFilter = this.rowDataInfotest;
        this.prductNFilter = this.rowDataInfoModal

      },

      onCellClicked2(event){
        console.log('행 클릭 이벤트 확인');
        console.log(event.data.cmpds_prdlst_code);
        this.code = event.data.cmpds_prdlst_code;
        this.cnsumCount = event.data.cnsum_count;
        this.cmpdsCode = event.data.cmpds_no;
      },

      async deleteRow() {
        if (!this.gridOptions.api) {
            console.error("AgGrid API가 초기화되지 않았습니다.");
            return;
        }

        // 선택된 행 가져오기
        let selectedNodes = this.code;
        console.log(selectedNodes);
        if (selectedNodes.length === 0) {
            this.toast.add({ severity: 'warn', summary: '경고', detail: '행을 선택하세요', life: 3000 });
            return;
        }

        //let selectedData = selectedNodes[0].data; // 첫 번째 선택된 데이터만 사용

        // 데이터 삭제 요청
        if (!this.cnsumCount) {
            // 저장되지 않은 새 데이터 삭제
            this.rowDataInfo = this.rowDataInfo.filter(
                (row) => row.cmpds_prdlst_code !== selectedNodes
            );
            this.toast.add({ severity: 'success', summary: '삭제 완료', detail: '저장되지 않은 데이터가 삭제되었습니다.', life: 3000 });
            console.log(this.rowCount);
            console.log(this.rowDataInfo.length);
            
            // AgGrid 데이터 갱신
            if (this.gridOptions.api) {
                this.gridOptions.api = this.rowDataInfo;
            }
        } else if (selectedNodes) {
            // 저장된 데이터 삭제
            try {
                console.log(this.cmpdsCode);
                let result = await axios.delete(`${ajaxUrl}/bom_cmpdsDel/${this.cmpdsCode}`);

                if (result.status === 200) { // 서버 응답 상태 코드가 200일 경우만 처리
                    this.toast.add({ severity: 'success', summary: '삭제 완료', detail: '저장된 데이터가 삭제되었습니다.', life: 3000 });

                    // 데이터에서 해당 행 삭제
                    this.rowDataInfo = this.rowDataInfo.filter(
                        (row) => row.cmpds_prdlst_code !== selectedNodes
                    );
                    this.rowCount = this.rowDataInfo.length;
                    // AgGrid 데이터 갱신
                    if (this.gridOptions.api) {
                        this.gridOptions.api = result.data;
                    }

                    // 버튼 비활성화 여부 처리
                    if (this.rowDataInfo.length == this.rowCount) {
                        this.isButtonDisabled = true;
                    }
                }
            } catch (err) {
                console.log(err)
            }
          }
      },


      async saveData() {
        let isSaveSuccessful = true; // 저장 성공 여부를 확인하는 변수
        let isUpdateSuccessful = false; // 업데이트 성공 여부를 확인하는 변수
        let newRowsAdded = false; // 새로 추가된 행이 있는지 체크하는 변수

        console.log('저장시 데이터', this.bomCode);
        console.log('첫 행길이',this.rowCount);
        console.log('추가행길이',this.rowDataInfo.length);
        // 새로운 행이 추가된 경우에만 등록 (새로운 행이 없으면 업데이트만)
        for (let i = this.rowCount; i < this.rowDataInfo.length; i++) {
            let row = this.rowDataInfo[i];
            let obj = [
                this.bomCode,
                row.cmpds_prdlst_code,
                row.cmpds_prdlst_name,
                row.unit,
                row.cnsum_count,
            ];
            console.log(this.rowDataInfo[i].cnsum_count);
            // 값이 null일 경우 저장을 진행하지 않음
            if (this.rowDataInfo[i].cnsum_count === null || this.rowDataInfo[i].cnsum_count === undefined) {
                this.toast.add({ severity: 'warn', summary: '경고', detail: '값을 입력해주세요', life: 3000 });
                isSaveSuccessful = false; // 값이 null일 때는 저장을 하지 않음
                break; // 더 이상 진행하지 않도록 중단
            } else {
                try {
                    let result;
                    console.log('여러행insert체크',row.isNewRow)
                    if (row.isNewRow) {
                        // 새 행인 경우 등록
                        console.log(obj);
                        result = await axios.post(`${ajaxUrl}/bom`, obj);
                        // 서버에서 받은 cmpds_no로 업데이트
                        this.rowDataInfo[i].cmpds_no = result.data.cmpds_no;
                        newRowsAdded = true; // 새 행이 추가되었음을 표시
                        delete this.rowDataInfo[i].isNewRow; // 플래그 제거
                    } else {
                        // 기존 행인 경우 업데이트
                        result = await axios.put(`${ajaxUrl}/bom/${row.cmpds_no}`, obj);
                    }

                    // 데이터 저장 후 처리
                    let test = await axios.get(`${ajaxUrl}/bomManage/${this.selectedBomCode}`)
                                  .catch(err => console.log(err));
                      
                    if (this.gridOptions.api) {
                        this.gridOptions.api = test.data;
                    }
                    // this.rowDataInfo = this.rowDataInfo.map((row) => {
                    //     if (row.isNewRow) delete row.isNewRow; // 플래그 제거
                    //     return row;
                    // });
                } catch (err) {
                    console.log(err);
                    isSaveSuccessful = false; // 오류가 발생하면 저장 실패 처리
                    break; // 오류가 나면 더 이상 진행하지 않도록 중단
                }
            }
        }

        // 항상 업데이트 요청
        let info = {
            prdctn_qy: this.productionQty,
            sumry: this.remarks
        };
        
        try {
            let result = await axios.put(`${ajaxUrl}/bomUpdate/${this.bomCode}`, info);
            console.log(result);
            isUpdateSuccessful = true;
        } catch (err) {
            console.log(err);
        }

        if (isSaveSuccessful && isUpdateSuccessful) {
            this.toast.add({ severity: 'success', summary: '저장 완료', detail: '모든 데이터가 성공적으로 저장되었습니다.', life: 3000 });
            // setTimeout(() => {
            //     this.$router.go(0); // 새로고침
            // }, 500);
        }
      },
      

      async update() {
        let isUpdateSuccessful = true; // 업데이트 성공 여부 추적 변수

        for (let i = 0; i < this.rowData.length; i++) {
            let row = this.rowData[i];
            let obj = {
                cnsum_count: row.cnsum_count
            };

            try {
                let result = await axios.put(`${ajaxUrl}/bom_cmpsdUpdate/${row.cmpds_no}`, obj);
            } catch (err) {
                console.log(err);
                isUpdateSuccessful = false; // 오류 발생 시 실패로 설정
                break; // 오류 발생 시 루프 종료
            }
        }

        if (isUpdateSuccessful) {
            // 모든 요청이 성공적으로 처리된 경우
            this.toast.add({ severity: 'success', summary: '업데이트 완료', detail: '모든 데이터가 성공적으로 업데이트되었습니다.', life: 3000 });
        } else {
            this.toast.add({ severity: 'error', summary: '업데이트 실패', detail: '데이터 업데이트 중 오류가 발생했습니다.', life: 3000 });
        }
      },

      // 모달값 rowDataInfo그리드로 데이터 넘기기
      onCellClicked3(event){
        let obj = {
            cmpds_prdlst_code:  event.data.mtril_code,
            cmpds_prdlst_name:  event.data.mtril_name,
            unit: event.data.unit,
            isNewRow: true
        }
        if(event.colDef.field === "선택"){
          if(event.data.mtril_code == null){
            obj = {
              cmpds_prdlst_code:  event.data.prdlst_code,
              cmpds_prdlst_name:  event.data.prdlst_name,
              unit: event.data.unit,
              isNewRow: true
            }
          }
          const isDuplicate = this.rowDataInfo.some(
            (row) => row.cmpds_prdlst_code === obj.cmpds_prdlst_code
          );
          if (!isDuplicate) {
            this.rowDataInfo = [...this.rowDataInfo, obj];
            // 저장버튼 활성화
            this.isButtonDisabled = false;
            // if (this.gridOptions.api) {
            //   this.gridOptions.api.setRowData(this.rowDataInfo);
            // }
          } else {
            // 저장버튼 비활성화
            this.isButtonDisabled = true;
            this.toast.add({ severity: 'warn', summary: '경고', detail: '이미추가된 항목 입니다.', life: 3000 });
          }
        }
      },

      // 그리드 초기화
      onGridReady(params) {
        this.gridOptionsReturn.api = params.api;
        this.gridOptionsReturn.columnApi = params.columnApi;
      },
      onGridReady2(params) {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;

        if (!this.gridOptions.api) {
          console.error("AgGrid API가 초기화되지 않았습니다.");
        }
      },

      mtrilModalOpen(){
        this.mtrilModal = true;
        this.prdlstNModal = false;
      },
      prdlstNModalOpen(){
        this.mtrilModal = false;
        this.prdlstNModal = true;
      }
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
.editable-input {
  border: 2px solid #00aaff; /* 수정 가능 강조 */
}

</style>