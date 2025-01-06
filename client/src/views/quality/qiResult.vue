<template>
    <div>
        <v-card class="mx-auto card-custom-1" style="border-radius:13px; text-align: center;">
            <template v-slot:title>
                <span class="font-weight-black">
                    품질 검사 내역 조회
                </span>
            </template>
            <v-card-text class="bg-surface-light pt-4">
                <div class="search-bar">
                    <div>
                        <div>
                            <span>품질검사 코드 </span>
                            <InputText type="text" v-model="checkCode" v-on:keyup.enter="getList"> <p>{{ checkCode }}</p></InputText>
                        </div>
                        <div>
                            <span>자재명 </span>
                            <InputText type="text" v-model="mtrilName" v-on:keyup.enter="getList"> <p>{{ mtrilName }}</p></InputText>
                        </div>
                        <div>
                            <span>검사 결과 </span>
                            <select v-model="pResult">
                                <option value="">전체</option>
                                <option value="합격">합격</option>
                                <option value="불합격">불합격</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>검사일 </span>
                            <InputText type="date" v-model="startDate"> <p>{{ startDate }}</p></InputText> -
                            <InputText type="date" v-model="endDate"> <p>{{ endDate }}</p></InputText>
                        </div>
                        <div>
                            <span>거래처명 </span>
                            <InputText type="text" v-model="companyName" v-on:keyup.enter="getList"> <p>{{ companyName }}</p></InputText>
                        </div>
                        <div>
                            <span>담당자 </span>
                            <InputText type="text" v-model="chargerName" v-on:keyup.enter="getList"> <p>{{ chargerName }}</p></InputText>
                        </div>
                    </div>
                    <div class="search-btn">
                        <button type="button" @click="removeData" class="btn btn-secondary"
                        style="line-height: 1px; color: #fff;">초기화</button>
                        <button type="button" @click="getList" class="btn btn-primary"
                        style="line-height: 1px; color: #fff;">조회</button>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    
        <v-card-text class="bg-surface-light pt-4" style="margin-top: 30px;">
            <ag-grid-vue :rowData="qiListRowData" 
            :columnDefs="colDefs" 
            :gridOptions="qiListGridOptions" style="height: 520px"
            @grid-ready="onGridReady" class="ag-theme-alpine">
            </ag-grid-vue>
        </v-card-text>
    </div>

</template>

<script setup>
import { ref } from 'vue';
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import userDateUtils from '@/utils/useDates.js';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

//행 데이터
const qiListRowData = ref([]);

//검색 데이터
const checkCode = ref("");
const pResult = ref(""); //기본값 설정 (전체)
const mtrilName = ref("");
const companyName = ref("");
const startDate = ref("");
const endDate = ref("");
const chargerName = ref("");

//품질검사코드, 검사기준, 제품 검사 결과, 거래처명, 자재코드, 자재명, 합격 수량, 불량 수량, 단위, 검사일자, 담당자 
// 날짜 포멧에 맞춰서 설정
const customDateFormat = (params) => {      
    return userDateUtils.dateFormat(params.data.test_date, 'yyyy-MM-dd');
};

const colDefs = [
    { field: "mtril_check_code",headerName: "검사 코드", flex: 0.7},
    { field: "inspec_standard",headerName: "검사 기준", flex: 1},
    { field: "p_result",headerName: "검사 결과", flex: 0.6},
    { field: "mtlty_name",headerName : "거래처명", flex: 1},
    { field: "mtril_name",headerName: "자재명", flex: 1},
    { field: "pass_amount",headerName : "합격 수량", flex: 1},
    { field: "error_amount",headerName : "불량 수량", flex: 1},
    { field: "unit",headerName : "단위", flex: 0.7},
    { field: "test_date",headerName : "검사일자", valueFormatter: customDateFormat, flex: 1 },
    { field: "empl_name",headerName : "담당자", flex: 0.8}, 
];

//품질 검사 리스트 그리드 옵션
const qiListGridOptions = {columnDefs: colDefs,
                            pagination: true,
                            paginationPageSize: 10,
                            paginationPageSizeSelector: [10, 20, 50, 100],
                            paginateChildRows: true,
                            animateRows: false};

const getList = async () => {
    //검색 데이터 객체
    let info = {mtril_check_code: checkCode.value,
                p_result: pResult.value,
                mtril_name: mtrilName.value,
                mtlty_name: companyName.value,
                test_date_start: startDate.value,
                test_date_end: endDate.value,
                empl_name: chargerName.value
            };

    let result = await axios.post(`${ajaxUrl}/quality/qiResult`, info)
                                .catch(err => console.log(err));
    //console.log('-------------', result);
    //테이블에 데이터 넣기
    qiListRowData.value = result.data;
};
getList();

//데이터 초기화
const removeData = () => {
    qiListRowData.value = "";
    checkCode.value = "";
    pResult.value = "";
    mtrilName.value = "";
    companyName.value = "";
    startDate.value = "";
    endDate.value = "";
    chargerName.value = "";
    //전체조회
    getList();
};

</script>

<style scoped>
.search-btn {
    margin-top: 20px;
}
.search-btn button {
    margin: 0 10px;
}
.search-bar div:nth-of-type(1){
    width: 45%;
    display: inline-block;
}
.search-bar div:nth-of-type(1) div {
    text-align: left;
    width: 100%;
}
.search-bar div:nth-of-type(2) {
    width: 45%;
    display: inline-block;

}
.search-bar div:nth-of-type(2) div{
    width: 100%;
    text-align: left;
}
.search-bar>div>div span {
    display: inline-block;
    width: 100px;
}
select {
  -webkit-appearance: auto;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #d6d6d6;
  width: 80px;
  height: 42px;
  text-align: center;
  margin-right: 20px;
}
input{
    margin-bottom: 10px;
}
</style>