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
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">거래처 코드</label>
                </div>
                <div class="col-1">
                  <input type="text" id="itemCode" class="form-control" v-model="bcncCode" />
                </div>
                <!-- 품목코드 --> 
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">거래처 이름</label>
                </div>
                <div class="col-2">
                  <input type="text" id="itemCode" class="form-control" v-model="mtltyName" />
                </div>
                <div class="col-auto">
                  <label for="searchType" class="col-form-label">업태</label>
                </div>
                <div class="col-auto">
                  <select v-model="searchBizcnd" class="form-control" id="seCode">
                    <option value="생산">생산</option>
                    <option value="도소매">도소매</option>
                  </select>
              </div>
                <!-- <div class="col-auto">
                  <label for="itemCode" class="col-form-label">종목</label>
                </div>
                <div class="col-2"> 
                  <input type="text" id="itemCode" class="form-control" v-model="searchItem" />
                </div> -->
                <div class="col-auto">
                  <label for="itemCode" class="col-form-label">담당자 명</label>
                </div>
                <div class="col-auto">
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
                <div class="d-flex justify-content-center mt-4">
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
            <v-card-text class="bg-surface-light pt-4" style="height: 595px">
              <v-col cols="12" class="mb-4">
              <div class="col-auto">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">사업자등록번호</label>
              </div>
              <div class="col-auto">
                <input type="text" id="bizrnoAdd" class="form-control" v-model="bizrnoAdd" />
              </div>
              <div class="col-auto">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">거래처 명</label>
              </div>
              <div class="col-auto">
                <input type="text" id="mtrilNameAdd" class="form-control" v-model="bcncNameAdd" />
              </div>
              <div class="col-auto">
                  <span>*</span>
                  <label for="searchType" class="col-form-label">업태</label>
                </div>
                <div class="col-auto">
                  <select v-model="bizcnDAdd" class="form-control" id="seCode">
                    <option value="생산">생산</option>
                    <option value="도소매">도소매</option>
                  </select>
              </div>
              <div class="col-auto">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">종목</label>
              </div>
              <div class="col-auto">
                <InputText type="text" v-model="itemAdd" style="width:420px"> <p>{{ itemAdd }}</p></InputText>
              </div>
              <div class="col-auto">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">납품주소</label>
              </div>
              <div class="col-auto">
                <input type="text" id="dvyfgAdresAdd" class="form-control" v-model="dvyfgAdresAdd" />
              </div>
              <div class="col-auto">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">담당자명</label>
              </div>
              <div class="col-auto">
                <input type="text" id="chargerNameAdd" class="form-control" v-model="chargerNameAdd" />
              </div>
              <div class="col-auto">
                  <span>*</span>
                  <label for="itemCode" class="col-form-label">담당자전화번호</label>
              </div>
              <div class="col-auto">
                <input type="text" id="chargerPhoneAdd" class="form-control" v-model="chargerPhoneAdd" />
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
              <span class="font-weight-black">거래처 리스트</span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
              <!-- AgGrid -->
              <AgGridVue
                style="height: 520px; margin: 0 auto;"
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
                <button class="btn btn-danger" @click="deleteRow" >삭제</button>
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
import userDateUtils from '@/utils/useDates.js';
import { useToast } from "primevue";

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
      bizrnoAdd : "",         // 사업자등록번호
      bcncNameAdd : "",       // 상호명
      bizcnDAdd : "",         // 업태
      itemAdd  : "",          // 종목
      dvyfgAdresAdd  : "",    // 납품주소
      chargerNameAdd  : "",   // 담당자 명
      chargerPhoneAdd  : "",  // 담당자 전화번호

      toast: useToast(),

      // 업태 선택에 따른 종목 리스트
      itemOptions: {
        // 생산: ["폴리카보네이트", "폴리우레탄", "실리콘", "가죽", "알루미늄", "원목", "카본", "폴리프로필렌",
        //       "염료"
        // ],
        도소매: ["케이스"],
      },
      filteredItemOptions: []
    };
  },
  watch: {
    bizcnDAdd() {
      this.updateItemOptions();
    },
  },
  created() {
    this.getbcncList();
    this.updateItemOptions();

    this.colDefs = [
      { field: "bcnc_code", headerName: "거래처 코드" },
      { field: "bizrno", headerName: "사업자 등록 번호" },
      { field: "mtlty_name", headerName: "거래처 명" },
      { field: "bizcnd", headerName: "업태" },
      { field: "item", headerName: "종목"  ,editable: true},
      { field: "dvyfg_adres", headerName: "납품 주소" },
      { field: "charger_name", headerName: "담당자 명" , editable: true},
      { field: "charger_phone", headerName: "담당자 번호" , editable: true},
      { field: "regist_day", headerName: "등록 날짜" ,
          valueFormatter: this.customDateFormat
      },
    ];
    
    this.gridOptionsReturn = {
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
        flex: 1,
        minWidth: 10,
      },
      rowSelection: "single",
    };
    
  },
  methods: {
    updateItemOptions() {
      // 선택된 업태에 따라 종목 옵션 업데이트
      this.filteredItemOptions = this.itemOptions[this.bizcnDAdd] || [];
      // 종목 기본값 초기화
      this.itemAdd = this.filteredItemOptions.length ? this.filteredItemOptions[0] : "";
    },

    // 셀 값 변경 이벤트 핸들러
    onCellValueChanged() {
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

    // 거래처 등록
    async addData(){
      let obj = [
        this.bizrnoAdd,
        this.bcncNameAdd,
        this.bizcnDAdd,
        this.itemAdd,
        this.dvyfgAdresAdd,
        this.chargerNameAdd,
        this.chargerPhoneAdd
      ]
      console.log(obj);
      if(!this.bizrnoAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '사업자등록번호를 입력하세요.', life: 3000 });
      }else if(!this.bcncNameAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '거래처명을 입력하세요.', life: 3000 });
      }else if(!this.bizcnDAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '업태를 입력하세요.', life: 3000 });
      }else if(!this.itemAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '종목을 입력하세요.', life: 3000 });
      }else if(!this.dvyfgAdresAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '납품주소를 입력하세요.', life: 3000 });
      }else if(!this.chargerNameAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '담당자명을 입력하세요.', life: 3000 });
      }else if(!this.chargerPjoneAdd){
        this.toast.add({ severity: 'warn', summary: '경고', detail: '담당자전화번호를 입력하세요.', life: 3000 });
      }else{
        let result = await axios.post(`${ajaxUrl}/bcncAdd`, obj)
                          .catch(err => console.log(err));
        if(result.status == 200){
          let result2 = await axios.get(`${ajaxUrl}/bcncList`)
            .catch(err => console.log(err));
            this.bcncList = result2.data;
            this.rowData = this.bcncList;
            this.filteredRowData = this.rowData;
            this.toast.add({ severity: 'success', summary: '성공', detail: '등록되었습니다.', life: 3000 });
        }else{
          this.toast.add({ severity: 'warn', summary: '실패', detail: '등록 중 오류가 발생하엿습니다.', life: 3000 });
        }
      }
        
                        
    },

    async saveChanges(){
      let check = true;
      for(let i = 0; i < this.rowData.length; i++){
        let row = this.rowData[i];
        let obj = {
          charger_name: row.charger_name,
          charger_phone: row.charger_phone,
        }
        //console.log(obj);
        try{
          let result = await axios.put(`${ajaxUrl}/bcncUpdate/${this.rowData[i].bcnc_code}`, obj)
                                  .catch(err => console.log(err));
        }catch{
          check = false;
        }
        // let result2 = await axios.get(`${ajaxUrl}/bcncList`)
        //                           .catch(err => console.log(err));
        //   this.bcncList = result2.data;
        //   this.rowData = this.bcncList;
        //   this.filteredRowData = this.rowData;
      }
      if(check){
        this.toast.add({ severity: 'success', summary: '업데이트 완료', detail: '모든 데이터가 성공적으로 업데이트되었습니다.', life: 3000 });
      }else{
        this.toast.add({ severity: 'error', summary: '업데이트 실패', detail: '데이터 업데이트 중 오류가 발생했습니다.', life: 3000 });
      }
    },

    // 거래처 삭제
    deleteRow() {
        const selectedNodes = this.gridOptionsReturn.api.getSelectedNodes();

        if (selectedNodes.length === 0) {
          this.toast.add({ severity: 'warn', summary: '경고', detail: '삭제할 행을 선택하세요.', life: 3000 });
          return;
        }

        const selectedData = selectedNodes.map((node) => node.data);

        this.rowData = this.rowData.filter(
          (row) => !selectedData.some((selected) => selected.bcnc_code === row.bcnc_code)
        );

        this.gridOptionsReturn.api.applyTransaction({ remove: selectedData });

        selectedData.forEach((data) => {
          console.log(data.bcnc_code);
          if (data.bcnc_code) {
            let result = axios.delete(`${ajaxUrl}/bcnc_code/${data.bcnc_code}`)
              .then(() => console.log(`행 삭제 완료: ${data.bcnc_code}`))
              .catch((err) => console.error(`행 삭제 실패: ${data.bcnc_code}`, err));
              console.log(result);
            if(result){
              this.toast.add({ severity: 'success', summary: '성공', detail: '삭제가 완료되었습니다.', life: 3000 });
            }else{
              this.toast.add({ severity: 'warn', summary: '경고', detail: '삭제 중 오류가 발생하엿습니다.', life: 3000 });
            }
          }
        });
    },

    // 검색값에 따른 필터링
    filterByCode() {

      let startDate =  new Date(this.startDate).setHours(0, 0, 0, 0);
      let endDate =  new Date(this.endDate).setHours(0, 0, 0, 0);

      this.filteredRowData = this.rowData.filter((row) => {

        let newDate = new Date(row.regist_day).setHours(0,0,0,0);
        return (
          (!this.bcncCode || row.bcnc_code.includes(this.bcncCode)) &&
          (!this.mtltyName || row.mtlty_name.includes(this.mtltyName)) &&
          (!this.searchBizcnd || row.bizcnd.includes(this.searchBizcnd)) &&
          (!this.searchItem || row.item.includes(this.searchItem)) &&
          (!this.chargerName || row.charger_name.includes(this.chargerName)) &&
          (!startDate || newDate >= startDate) &&
          (!endDate || newDate <= endDate)
        );
      });
    },
    
    // 등록 input 초기화
    reset(){
      this.bizrnoAdd = "";         // 사업자등록번호
      this.bcncNameAdd = "";       // 상호명
      this.bizcnDAdd = "";         // 업태
      this.itemAdd  = "";          // 종목
      this.dvyfgAdresAdd  = "";    // 납품주소
      this.chargerNameAdd  = "";   // 담당자 명
      this.chargerPhoneAdd  = "";  // 담당자 전화번호
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
    //날짜 yyyy-MM-dd형식에 맞춰서 가져오기
    customDateFormat(params) {
            return userDateUtils.dateFormat(params.data.regist_day, 'yyyy-MM-dd');  // test_date는 알레아스 이름
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
