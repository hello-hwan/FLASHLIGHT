<template>
  <div class="container">
    <!-- 생산지시 테이블 검색 -->
    <div class="prod-schedule">
      <p>생산 일정 안내 </p>

      <!-- 일자 검색 -->
      <input type="date" v-model="day">

      <!-- 제품 검색 제품명 입력시 아래 코드 나옴 클릭하면 선택됨 -->
      <input type="text" placeholder="제품코드" v-model="prd" @keydown="getprdlist()">

      <!-- 검색 목록 있을시 표시 -->
      <div v-if="prdlist.length > 0">
        <ul>
          <li v-for="prdst in prdlist" :key="prdst.prdlst_code" @click="getprdcode(prdst.prdlst_code)">{{ prdst.prdlst_code + ', ' + prdst.prdlst_name }}</li>
        </ul>
      </div>

      <!-- 버튼 클릭시 검색창 적용 -->
      <button type="button" @click="getanotherlist(prd, day)">검색</button>
    </div>

    <!-- 생산지시 테이블 -->
    <div class="table-container">
      <table class="table">

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

      <!-- 검색없을시 표시창 생산 불가능 제품 및 자재 목록 -->
      <ImpossibleProduction v-if="!issrc"/>

      <!-- 검색 없을시 표시창 자체 생산 지시 추가 -->
      


    </div>
</template>

<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';
  import useDates from '@/utils/useDates';
  import ImpossibleProduction from '@/components/production/ImpossibleProduction.vue';

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
   let result = await axios.get(`${ajaxUrl}/prod/drctlist`, {params: {"prd_code":prd_code, "day_str":day_str}})
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
  // 생산일정 불러올 함수 실행
  getdrct(prd.value, day.value);

  
  // 검색을 했는지 안했는지 담을 변수
  let issrc = false;

  // 제품 키워드로 검색 내용 담을 변수
  const prdlist = ref([]);

  // 제품 키워드로 검색할 함수
  const getprdlist = async () => {
    let result = await axios.get(`${ajaxUrl}/prod/prdlist/${prd.value}`)
                            .catch(err => console.log(err));
    prdlist.value = result.data;
  };
  // 검색 클릭시 실행할 함수
  const getprdcode = (code) => {
    prd.value = code;
    prdlist.value = [];
  };

  // 검색 클릭시 실행할 함수
  const getanotherlist = async (prd_code, day_str) => {
    getdrct(prd_code, day_str);
    issrc = true;
  };
</script>

<style>
  .table th, .table td {
    border: 2px, solid, black;
    width: 0.5%;
  }

</style>