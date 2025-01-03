<template>
  <v-card class="mx-auto card-custom-1" style="border-radius:13px;">
        <template v-slot:title>
            <span class="font-weight-black">
                공장 실적 조회
            </span>
        </template>
    </v-card>
    <v-container fluid>
        <v-row>
        <!-- 검색 필드 -->
        <v-col cols="12">
          <v-card class="mx-auto" style="border-radius: 13px;">
            <v-card-text class="bg-surface-light pt-4">
                    <div class="row g-3 align-items-center">
                        <div class="col-2">
                            <label for="state_procs_code" class="col-form-label">공정 코드</label>
                        </div>
                        <div class="col-auto">
                            <input type="text" id="state_procs_code" class="form-control" aria-describedby="passwordHelpInline" placeholder="공정명, 제품명 입력시 검색 가능" v-model="pcode" @keydown="getprocs()">
                            <div class="search-procs-box">
                              <select name="pcode" id="pcode_box" v-model="pcode">
                                <option selected :value="pcode" hidden>공정을 선택해주세요</option>
                                <option v-for="procs in procslist" :value="procs.procs_code">{{ procs.prd_nm + '-' +  procs.procs_ordr_no + '-' + procs.procs_nm }}</option>
                              </select>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 align-items-center">
                      <div class="col-2">
                        <label for="state_empl_no" class="col-form-label">사원 번호</label>
                      </div>
                      <div class="col-auto">
                        <input type="text" id="state_empl_no" class="form-control" aria-describedby="passwordHelpInline" placeholder="사원번호를 입력하세요." v-model="eno">
                      </div>
                    </div>
                    <div class="row g-3 align-items-center">
                        <div class="col-2">
                            <label for="state_date" class="col-form-label">날짜</label>
                        </div>
                        <div class="col-auto">
                            <input type="date" id="state_date" class="form-control" aria-describedby="passwordHelpInline" style="width: 220px;" v-model="edate">
                        </div>
                    </div>
                    <div style="margin-top:10px;">
                        <button type="button" class="btn btn-success" style="color:white;" @click="getlist">조회</button>
                        <button type="button" class="btn btn-warning" @click="resetvalue">초기화</button>
                    </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-card-text class="bg-surface-light pt-4">
        <div>
          <AgGridVue style=" height: 600px; margin: 0 auto;"
                  :defaultColDef="defaultColDef"
                  :rowData="rowData"
                  :gridOptions="gridOptions"
                  class="ag-theme-alpine">
              </AgGridVue>
        </div>
    </v-card-text>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import useDates from "@/utils/useDates";

const pcode = ref("");
const eno = ref("");
const edate = ref("");

//행 정보
const rowData = ref([]);

// 컬럼명 정의
// field : 배열안 객체의 필드명, headerName : 우리가 표시할 컬럼 이름, flex: 열 크기, hide: 숨길건지(검색시 필요할수도 있으니 표시할거만 표시), suppressToolPanel: hide 쓰면 같이 써야하는거
const ColDefs = [
  { field: "prdctn_code", headerName:"생산지시코드", hide:true, suppressToolPanel: true},
  { field: "procs_code", headerName:"공정코드", hide:true, suppressToolPanel: true},
  { field: "procs_nm", headerName:"공정명"},
  { field: "eqp_code", headerName:"설비코드"},
  { field: "empl_no", headerName:"작업자 번호", hide:true, suppressToolPanel: true},
  { field: "empl_nm", headerName:"작업자"},
  { field: "begin_time", headerName:"시작일자", flex:1.5},
  { field: "end_time", headerName:"종료일자", flex:1.5},
  { field: "nrmlt", headerName:"양품 수", flex:0.8},
  { field: "badn", headerName:"불량품 수", flex:0.8},
];

// 공정 현황 리스트 불러오기
const getlist = async () => {
  let result = await axios.get(`${ajaxUrl}/prod/statelist`, { params : { "procs_code": pcode.value, "empl_no": eno.value, "end_date": edate.value }})
                          .catch(err => console.log(err));
  for(let i = 0; i < result.data.length; i++){
    result.data[i].begin_time = useDates.dateFormat(result.data[i].begin_time, 'yyyy-MM-dd') + ' ' +  useDates.timeFormat(result.data[i].begin_time, 'hh:mm:ss');
    result.data[i].end_time = useDates.dateFormat(result.data[i].end_time, 'yyyy-MM-dd') + ' ' +  useDates.timeFormat(result.data[i].end_time, 'hh:mm:ss');
    
  }
  rowData.value = result.data;
};

const resetvalue = async () => {
  pcode.value = "";
  eno.value = "";
  edate.value = "";
  getlist();
};

const procslist = ref([]);

const getprocs = async () => {
  let result = await axios.get(`${ajaxUrl}/prod/procslist`, { params : { "name" : pcode.value } })
                          .catch(err => console.log(err));
  if(result != undefined){
    procslist.value = result.data;
  }
};

//ag grid 옵션 설정
const gridOptions = {
      columnDefs: ColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 25, 50, 100],
      paginateChildRows: true,
      defaultColDef: {
          flex: 1,
          minWidth: 10,
          headerClass: "centered",
          cellClass: "centered"
      },
};
onBeforeMount(() => {
  getlist();
  getprocs();
});


</script>

<style scoped>
.centered {
  .ag-header-cell-label {
    justify-content: center !important;
  }
}
.ag-row {
  .centered {
    justify-content: center !important;
    text-align: center;
  }
}
.ag-header-group-cell-label, .ag-header-cell-label {
    justify-content: center !important;
    text-align: center !important;
}
.ag-header-cell-text {
    text-align: center !important;
    margin: 0 auto !important;
}
.search-procs-box {
    position: relative;
    z-index: 1;
}
.search-procs-box select {
  position: absolute;
  top: -38px;
  left: 101%;
  background-color: white;
  height: 38px;
  width: 250px;
  border-radius: 8px;
}

</style>
