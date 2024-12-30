<template>
    <div class="main-contents">
        <div class="card flex flex-col gap-4">
            <div class="font-semibold text-xl">재고 조회</div>
            <div class="grid grid-cols-12 gap-2">
                <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Name</label>
                <div class="col-span-12 md:col-span-10">
                    <InputText id="name3" type="text" />
                </div>
            </div>
            <div class="grid grid-cols-12 gap-2">
                <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Email</label>
                <div class="col-span-12 md:col-span-10">
                    <InputText id="email3" type="text" />
                </div>
            </div>
        </div>
        <!--자재 리스트-->
        <v-card
            class="mx-auto"
            style=" border-bottom-right-radius: 13px;
                    border-bottom-left-radius: 13px;"
            >
            <template v-slot:title>
            <span class="font-weight-black">재고조회</span>
            </template>
        
            <v-card-text class="bg-surface-light pt-4">
                <!--ag grid영역-->
                <AgGridVue style=" height: 519px; margin: 0 auto;"
                    :rowData="mtRowData"
                    :gridOptions="gridOptions"
                    class="ag-theme-alpine">
                </AgGridVue>
            </v-card-text>
        </v-card>

        <div class="modal-wrap" @click="modalOpen" v-show="modalCheck">
            <div class="modal-container" @click.stop="">
                <div id="search-bar">
                    <div class="align-left">                
                        <span>로트명</span>
                        <InputText type="text" v-model="keyLotName" v-on:keyup.enter="searchMt"> <p>{{ keyLotName }}</p></InputText>
                        <span>입고 담당자</span>
                        <InputText type="text" v-model="wrhousingCharger" v-on:keyup.enter="searchMt"> <p>{{ wrhousingCharger }}</p></InputText>
                        <span>입고일</span>
                        <InputText type="date" v-model="wrhDateStart" v-on:keyup.enter="searchMt"> <p>{{ wrhDateStart }}</p></InputText>
                        <InputText type="date" v-model="wrhDateEnd" v-on:keyup.enter="searchMt"> <p>{{ wrhDateEnd }}</p></InputText>
                    </div>
                    <button @click="searchMt"class="btn btn-primary search-btn" >조회</button>
                </div>
                
                <AgGridVue 
                    :rowData="lotRowData"
                    :gridOptions="lotGridOptions"
                    class="ag-theme-alpine"
                    style="height: 500px"
                    @grid-ready="onGridReady"
                    >
                </AgGridVue>
                
                <div class="modal-btn">
                <button @click="modalOpen"class="btn btn-secondary">닫기</button>
                <button @click="selectOrder" class="btn btn-primary">확인</button>
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
        { field: "mtril_name", headerName:"자재명"},
        { field: "mtril_code", headerName:"자재코드"},
        { field: "qy", headerName:"자재수량" },
        { field: "unit", headerName:"단위" },
        { field: "sfinvc", headerName:"안전재고 수량" },
        { headerName: "선택", cellRenderer: switchBtn}  //버튼 컴포넌트 설정
        ];

//자식 컴포넌트에서 가져온 내용을 연결하는 함수
const getMtRowData = (mtRowInfo) => {
    console.log(mtRowInfo);
    //모달 열기
    modalCheck.value = true;

    //모달이 열리고 바로 검색하기 위해 자재 코드 입력
    mtrilCode = mtRowInfo.mtril_code;

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
    animateRows: false,
    defaultColDef: {
        filter: true,
        flex: 1,
        minWidth: 10
    }
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
let mtrilCode = null;

//검색조건
let keyLotName = null;  //로트명
let wrhousingCharger = null;    //입고담당자
let wrhDateStart = null;    //입고일 시작
let wrhDateEnd = null;  //일고일 끝

//그리드 api를 담을 변수
const lotGridApi = ref(null);

//grid가 생성될때 발생한 ag grid의 api를 변수에 담음
const onGridReady = (params) => {
    lotGridApi.value = params.api;
};

//모달 열림 상태 담을 변수
let modalCheck = ref(false);

//모달이 열리면 true로 변경, 스크롤 막기
const modalOpen = () => {
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
    
    //검색에 사용할 자재 코드
    mtrilCode = null;

    //검색조건
    keyLotName = null;
    wrhousingCharger = null;
};

//행 데이터를 담을 변수
const lotRowData = ref([]);

//열 정보: 번호, 발주명, 거래처코드, 거래처명, 선택
const lotColDefs = [
  { field: "mtril_name", headerName: "자재명"},
  { field: "mtril_lot", headerName: "로트명"},
  { field: "mtril_qy", headerName: "재고 수량"},
  { field: "unit", headerName: "단위"},
  { field: "wrhousng_date", headerName: "입고일", valueFormatter: (params) => {
        //cusomDateFormat으로 해결이 안되어 직접 작성
          if (!params.value) {
            return "";
          }
          params.value = new Date(params.value);
          const month = params.value.getMonth() + 1;
          const day = params.value.getDate();
          return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        }},
  { field: "empl_name", headerName: "입고 담당자"}
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
    let obj = {mt_lot: keyLotName,
                charger: wrhousingCharger,
                start_wrhousng_date: wrhDateStart,
                end_wrhousng_date: wrhDateEnd,
                mtril_code: mtrilCode
            };

    console.log(obj);
    //console.log("새로만든 객체: ",obj);
    let result = await axios.post(`${ajaxUrl}/mtril/lot`, obj)
                            .catch(err=>console.log(err));

    //console.log("통신결과: ",result);
    //행 데이터 담기
    lotRowData.value = result.data;   
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
.main-contents {
    text-align: justify;
}
</style>