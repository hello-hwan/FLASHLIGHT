<template>
    <div class="main-contents">

        <!--자재 리스트-->
        <v-card
            class="mx-auto"
            style=" border-bottom-right-radius: 13px;
                    border-bottom-left-radius: 13px;"
            >
            <template v-slot:title>
            <span class="font-weight-black text-align-center">재고조회</span>
            </template>
        
            <v-card-text class="bg-surface-light pt-4">
                <!--ag grid영역-->
                <AgGridVue style=" height: 516px; margin: 0 auto;"
                    :rowData="mtRowData"
                    :gridOptions="gridOptions"
                    class="ag-theme-alpine"
                    @grid-ready="mtListQyOnGridReady"
                    overlayNoRowsTemplate="결과 없음">
                </AgGridVue>
                <button @click="onBtnExportDataAsCsvMtList" class="btn btn-primary search-btn" >EXCEL 내보내기</button>
            </v-card-text>
        </v-card>

        <div class="modal-wrap" @click="modalOpen" v-show="modalCheck">
            <div class="modal-container" @click.stop="">
                <div id="search-bar">
                    <div class="search-key">
                        <div>
                            <span>
                                <span>로트명 </span>
                                <InputText type="text" v-model="keyLotName" v-on:keyup.enter="searchMt"> <p>{{ keyLotName }}</p></InputText>
                            </span>
                            <span>
                                <span>입고담당자 </span>
                                <InputText type="text" v-model="wrhousingCharger" v-on:keyup.enter="searchMt" style="width: 310px"> <p>{{ wrhousingCharger }}</p></InputText>
                            </span>
                        </div>
                        <div>
                            <span>
                                <span>입고일 </span>
                                <InputText type="date" v-model="wrhDateStart" v-on:keyup.enter="searchMt"> <p>{{ wrhDateStart }}</p></InputText><span>-</span>
                                <InputText type="date" v-model="wrhDateEnd" v-on:keyup.enter="searchMt"> <p>{{ wrhDateEnd }}</p></InputText>
                            </span>
                        </div>          
                        <div>
                            <span>
                                <button @click="removeKey"class="btn btn-secondary search-btn" >초기화</button>
                                <button @click="searchMt"class="btn btn-primary search-btn" >조회</button>  
                                <button @click="onBtnExportDataAsCsvLotList" class="btn btn-primary search-btn" >EXCEL 내보내기</button>
                            </span>
                        </div>
                    </div>
                    
                </div>
                
                <AgGridVue 
                    :rowData="lotRowData"
                    :gridOptions="lotGridOptions"
                    class="ag-theme-alpine"
                    style="height: 516px"
                    @grid-ready="onGridReady"
                    overlayNoRowsTemplate="결과 없음"
                    >
                </AgGridVue>
                
                <div class="modal-btn">
                <button @click="modalOpen"class="btn btn-secondary">닫기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { ref } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

//버튼가져오기
import switchBtn from '@/components/materials/switchLotQy.vue';

//행 데이터
const mtRowData = ref([]);
//열정보
const mtColDefs = [
        { field: "mtril_name", headerName:"자재명", flex:1 },
        { field: "mtril_code", headerName:"자재코드", flex:1},
        { field: "qy", headerName:"자재수량", flex:1 },
        { field: "unit", headerName:"단위", flex:1 },
        { field: "sfinvc", headerName:"안전재고 수량", flex:1 },
        { headerName: "선택", cellRenderer: switchBtn, flex:1}  //버튼 컴포넌트 설정
        ];

//자식 컴포넌트에서 가져온 내용을 연결하는 함수
const getMtRowData = (mtRowInfo) => {
    console.log(mtRowInfo);
    //모달 열기
    modalCheck.value = true;

    //모달이 열리고 바로 검색하기 위해 자재 코드 입력
    mtrilCode.value = mtRowInfo.mtril_code;

    //자재 로트 전체 검색
    searchMt();
};

//자재 전체수량 
const gridOptions = {
    context: {
        componentParent: { getMtRowData } 
      },
    columnDefs: mtColDefs,
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
    paginateChildRows: true,

};

//데이터 가져오기
const getMtrilQy = async() => {
    let result = await axios.get(`${ajaxUrl}/mtril/mtAllQy`)
                            .catch(err=> console.log(err));

    //console.log(result.data);
    //행 데이터 담기
    mtRowData.value = result.data;
};
getMtrilQy();


/*모달관련 */

//검색에 사용할 자재 코드
const mtrilCode = ref(null);

//검색조건
const keyLotName = ref(null);  //로트명
const wrhousingCharger = ref(null);    //입고담당자
const wrhDateStart = ref(null);    //입고일 시작
const wrhDateEnd = ref(null);  //일고일 끝

//자재별 총 재고 수량 테이블 api를 담을 변수
const mtListApi = ref(null);

//자재별 총 재고 수량 테이블 grid api
const mtListQyOnGridReady = (params) => {
    mtListApi.value = params.api;
};

//자재 총 재고 수량 테이블 엑셀 내보내기
const onBtnExportDataAsCsvMtList = () => {
    mtListApi.value.exportDataAsCsv();
};

//그리드 api를 담을 변수
const lotGridApi = ref(null);

//grid가 생성될때 발생한 ag grid의 api를 변수에 담음
const onGridReady = (params) => {
    lotGridApi.value = params.api;
};

//특정 자재 로트별 수량 내보내기
const onBtnExportDataAsCsvLotList = () => {
    lotGridApi.value.exportDataAsCsv();
};

//모달 열림 상태 담을 변수
let modalCheck = ref(false);

//모달이 열리면 true로 변경, 스크롤 막기
const modalOpen = async() => {
    const html = document.querySelector('html');
    if(modalCheck.value == false) {
        modalCheck.value = !modalCheck.value;
        html.style.overflow = 'hidden';
    } else {
        modalCheck.value = !modalCheck.value;
        html.style.overflow = 'auto';
    };
    //행 데이터 초기화
    lotRowData.value = [];
    
    
    await searchMt();
    //검색에 사용할 자재 코드
    mtrilCode.value = null;
    
    //검색조건
    keyLotName.value = null;
    wrhousingCharger.value = null;
};

//행 데이터를 담을 변수
const lotRowData = ref([]);

//열 정보: 번호, 발주명, 거래처코드, 거래처명, 선택
const lotColDefs = [
  { field: "mtril_name", headerName: "자재명" , flex:1},
  { field: "mtril_lot", headerName: "로트번호", flex:1},
  { field: "mtril_qy", headerName: "재고 수량", flex:1},
  { field: "unit", headerName: "단위", flex:1},
  { field: "wrhousng_date", headerName: "입고일", flex:1, valueFormatter: (params) => {
        //cusomDateFormat으로 해결이 안되어 직접 작성
          if (!params.value) {
            return "";
          }
          params.value = new Date(params.value);
          const month = params.value.getMonth() + 1;
          const day = params.value.getDate();
          return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        }},
  { field: "empl_name", headerName: "입고 담당자", flex:1}
];

const lotGridOptions = {
      columnDefs: lotColDefs,
      animateRows: false,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
};

const searchMt = async() => {
    //서버로 보낼 검색 데이터
    let obj = {mt_lot: keyLotName.value,
                charger: wrhousingCharger.value,
                start_wrhousng_date: wrhDateStart.value,
                end_wrhousng_date: wrhDateEnd.value,
                mtril_code: mtrilCode.value
            };

    console.log(obj);
    //console.log("새로만든 객체: ",obj);
    let result = await axios.post(`${ajaxUrl}/mtril/lot`, obj)
                            .catch(err=>console.log(err));

    //console.log("통신결과: ",result);
    //행 데이터 담기
    lotRowData.value = result.data;   
};

const removeKey = () => {
    keyLotName.value = null  //로트명
    wrhousingCharger.value = null  //입고담당자
    wrhDateStart.value = null    //입고일 시작
    wrhDateEnd.value = null //일고일 끝
    //로트검색
    searchMt();
};
</script>

<style scoped>
/* dimmed */
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 5;
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
.btn-primary{
    line-height: 1;
}
.modal-btn {
    display: flex;
    justify-content: center;
}
.modal-btn button {
    margin: 10px 10px
}
#search-bar {
    border: 1px solid #c1c5cd;
}
.search-key div {
    margin-top: 20px;
}
.search-key {
    margin: 0 27px;
    text-align: left;
}
.search-key input {
    height: 36px;
}
.search-key div:first-child>:nth-child(1){
    margin-right: 15%;
}
.search-key div:first-child>:nth-child(1) input{
    width: 310px;
}
.search-key div:last-child>:nth-of-type(2){
    margin-left: 28%;
}
.search-key>span{
    position: relative;
    right: 0px;
}
.search-key div:last-child span {
    margin-left: 79%;
}
.text-align-center {
    display: flex;
    justify-content: center;
}
</style>