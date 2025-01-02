<template>
  <div class="container">
    <!-- 생산지시 테이블 검색 -->
    <div class="prod-schedule">
      <v-card class="mx-auto card-custom-1" style="border-radius:13px;">
        <template v-slot:title>
            <span class="font-weight-black">
              생산 일정 안내
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
                      <label for="drct_date" class="col-form-label">날짜</label>
                  </div>
                  <div class="col-auto">
                      <input type="date" id="drct_date" class="form-control" aria-describedby="passwordHelpInline" style="width: 220px;" v-model="day">
                  </div>
              </div>
              <div class="row g-3 align-items-center">
                <div class="col-2">
                  <label for="drct_prd_code" class="col-form-label">제품 코드</label>
                </div>
                <div class="col-auto">
                  <input type="text" id="drct_prd_code" class="form-control" aria-describedby="passwordHelpInline" placeholder="제품명 입력시 검색 가능" v-model="prd" @keydown="getprdlist()">
                  <!-- 검색값 있을 시 표시 -->
                  <div class="search-prd-box">
                    <select name="prd" id="prd_box" v-model="prd">
                      <option selected :value="prd" hidden>제품을 선택해주세요</option>
                      <!-- <option v-for="prdst in prdlist.filter((c) => c.prdlst_code == '')" :value="prd" selected hidden>{{ prdst.prdlst_name }}</option> -->
                      <option v-for="prdst in prdlist" :value="prdst.prdlst_code">{{ prdst.prdlst_name }}</option>
                    </select>
                  </div>
                </div>
                
              </div>
              <div style="margin-top:10px;">
                <button type="button" class="btn btn-success" style="color:white;" @click="getlist">조회</button>
                <button type="button" class="btn btn-warning" @click="resetvalue">초기화</button>
                <button type="button" class="btn btn-info" @click="getanotherlist(prd, day)">공정 현황 조회</button>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    </div>
    <v-card-text class="bg-surface-light pt-4">
      <!-- 생산지시 테이블 -->
      <div class="table-container">
        <table class="table-plan">
  
          <!-- 테이블 헤드 일자/오전,오후 -->
          <thead>
            <tr>
              <th rowspan="2">설비명</th>
              <th colspan="24"> {{ day }}</th>
              <th colspan="24">{{ useDates.dateFormat(new Date(day).setDate(new Date(day).getDate()+1), 'yyyy-MM-dd') }}</th>
              <th colspan="24">{{ useDates.dateFormat(new Date(day).setDate(new Date(day).getDate()+2), 'yyyy-MM-dd') }}</th>
              <th colspan="24">{{ useDates.dateFormat(new Date(day).setDate(new Date(day).getDate()+3), 'yyyy-MM-dd') }}</th>
              <th colspan="24">{{ useDates.dateFormat(new Date(day).setDate(new Date(day).getDate()+4), 'yyyy-MM-dd') }}</th>
              <th colspan="24">{{ useDates.dateFormat(new Date(day).setDate(new Date(day).getDate()+5), 'yyyy-MM-dd') }}</th>
              <th colspan="24">{{ useDates.dateFormat(new Date(day).setDate(new Date(day).getDate()+6), 'yyyy-MM-dd') }}</th>
            </tr>
            <tr>
              <th colspan="12">오전</th>
              <th colspan="12">오후</th>
              <th colspan="12">오전</th>
              <th colspan="12">오후</th>
              <th colspan="12">오전</th>
              <th colspan="12">오후</th>
              <th colspan="12">오전</th>
              <th colspan="12">오후</th>
              <th colspan="12">오전</th>
              <th colspan="12">오후</th>
              <th colspan="12">오전</th>
              <th colspan="12">오후</th>
              <th colspan="12">오전</th>
              <th colspan="12">오후</th>
            </tr>
          </thead>
  
          <!-- 테이블 바디 일정 표시할 목록 -->
          <tbody>
  
            <!-- 설비명 만큼 행 반복 -->
            <tr v-for="eqp in eqplist" :key="eqp.eqp_code">
              <th>{{ eqp.model_nm }}</th>
  
              <!-- 일정만큼 열 반복 -->
              <td v-for="drct in drctlist.filter((c)=> c.model_nm == eqp.model_nm)" :key="drct.prdctn_code" :colspan="drct.drct_time" :style="{backgroundColor : drct.color}"> {{ drct.prd_nm + " - " + drct.procs_nm }}</td>
  
              <!-- 데이터 없으면 표시할 데이터 -->
              <td v-if="drctlist.length == 0" colspan="168">No Data Found</td>
            </tr>
          </tbody>
          
          </table>
        </div>
    </v-card-text>

      <!-- 검색없을시 표시창 생산 불가능 제품 및 자재 목록 -->
      <ImpossibleProduction v-show="!issrc"/>

      <!-- 검색 없을시 표시창 자체 생산 지시 추가 -->
      <SelfProduction v-show="!issrc"/>

      <!-- 검색 있을시 표시창 공정실적조회 -->
      <StateList v-show="issrc" :date="day" :code="prd"/>

    </div>
</template>

<script setup>
  import { ref, onBeforeMount } from 'vue';
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';
  import useDates from '@/utils/useDates';
  import ImpossibleProduction from '@/components/production/ImpossibleProduction.vue';
  import SelfProduction from '@/components/production/SelfProduction.vue';
  import StateList from '@/components/production/StateList.vue';

  // 제품 검색 할 코드
  const prd = ref('');

  // 날짜 표기할 변수
  const day = ref('');
  day.value = useDates.dateFormat(new Date(), 'yyyy-MM-dd');
  
  
  // 설비리스트 담을 변수
  const eqplist = ref([]);
  
  // 설비 불러올 함수
  const getEqp = async () => {
    let result = await axios.get(`${ajaxUrl}/prod/eqplist`)
                            .catch(err => console.log(err));
    eqplist.value = result.data;
  };
  // 설비 불러올 함수 실행
  getEqp();


  // 생산일정 담을 변수
  const drctlist = ref([]);
  // 생산일정 불러올 함수
  const getdrct = async (prd_code, day_str) => {

   // let result = await axios.get(`${ajaxUrl}/prod/drctlist`)
   let result = await axios.get(`${ajaxUrl}/prod/drctlist`, { params: {"prd_code":prd_code, "day_str":day_str} })
                           .catch(err => console.log(err));
    // console.log(result);
    if(result == undefined){
      drctlist.value = [];
      return;
    }
    // 색상 배열
    const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "purple"];

    // 주문 번호 유니크하게 뽑아내고 주문번호를 매칭시키기 
    let newArray = [];
    let colorlist = result.data;
    for(let i = 0; i < colorlist.length; i++){
      newArray.push(colorlist[i].order_no);
    }
    // set에 넣어서 중복값 제거
    const set = new Set(newArray);
    newArray = [];
    let i = 0;
    // 배열에 key : value 값으로 집어넣기
    for(let key of set){
        if(key == "") {
          newArray[key] = "white";
        } else {
          if(i >= colors.length) i = 0;
          newArray[key] = colors[i++];
        }
    }
    
    // newArray = Array.from(set);
    
    // 결과에 color: value로 집어넣기
    for(let i=0; i < colorlist.length; i++){
      colorlist[i].color = newArray[colorlist[i].order_no];
    }
    drctlist.value = colorlist;

  };
  onBeforeMount(() => {
    // 생산일정 불러올 함수 실행
    getdrct(prd.value, day.value);
    getprdlist();
  })

  // 검색을 했는지 안했는지 담을 변수
  let issrc = ref(false);

  // 제품 키워드로 검색 내용 담을 변수
  const prdlist = ref([]);

  // 제품 키워드로 검색할 함수
  const getprdlist = async () => {
    let result = await axios.get(`${ajaxUrl}/prod/prdlist`, { params : { "name" : prd.value } })
                            .catch(err => console.log(err));
    prdlist.value = result.data;
  };
  

  // 검색 클릭시 실행할 함수
  const getprdcode = (code) => {
    prd.value = code;
    prdlist.value = [];
  };

  // 공정현황 조회 버튼 클릭시 실행할 함수
  const getanotherlist = async (prd_code, day_str) => {
    issrc.value = true;
    getdrct(prd_code, day_str);
  };

  // 초기화 버튼 클릭 함수
  const resetvalue = () => {
    issrc.value = false;
    prd.value = '';
    day.value = useDates.dateFormat(new Date(), 'yyyy-MM-dd');
    getdrct(prd.value, day.value);
    getprdlist();
  };

  // 단순 조회 버튼 클릭 함수
  const getlist = () => {
    getdrct(prd.value, day.value);
  };

</script>

<style scoped>
  .table-plan th, .table-plan td {
    border: 2px, solid, black;
    width: 0.5%;
    background-color: white;
  }
  .table-plan {
    border: 2px, solid, black !important;
    border-radius: 30px !important;
  }
  .search-prd-box {
    position: relative;
    z-index: 1;
  }
  .search-prd-box select {
    position: absolute;
    top: -38px;
    left: 101%;
    background-color: white;
    height: 38px;
    width: 220px;
    border-radius: 8px;
  }
</style>