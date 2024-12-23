<template>
  <div>
    <div>
      <p>생산 일정 안내 </p>
      <input type="date" v-model="day">
      <input type="text" placeholder="제품코드" v-model="prd" @keydown="getprdlist()">
      <div v-if="prdlist.length > 0">
        <p v-for="prdst in prdlist" :key="prdst.prdlst_code" @click="getprdcode(prdst.prdlst_code)">{{ prdst.prdlst_code + ', ' + prdst.prdlst_name }}</p>
      </div>
      <button type="button" @click="getanotherlist(prd, day)">검색</button>
    </div>
    <div>
      <table class="table">
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
            <th colspan="12">{{ prd }}</th>
            <th colspan="12">오후</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="eqp in eqplist" :key="eqp.eqp_code">
            <th>{{ eqp.model_nm }}</th>
            <td v-for="drct in drctlist" :key="drct.prdctn_code" :colspan="drct.drct_time" v-show="eqp.model_nm = drct.model_nm"> {{ drct.prd_nm + ' 제품\n'+ drct.procs_nm + ' 작업' }}</td>
          </tr>

        </tbody>
        
        </table>
      </div>
    </div>
</template>

<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';
  import useDates from '@/utils/useDates';

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
  const getdrct = async () => {
   // let result = await axios.get(`${ajaxUrl}/prod/drctlist`)
   let result = await axios.get(`${ajaxUrl}/prod/seldrct`)
                           .catch(err => console.log(err));
    drctlist.value = result.data;

  };
  // 생산일정 불러올 함수 실행
  getdrct();

  

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

    let result = await axios.get(`${ajaxUrl}/prod/srcdrct`, )
                            .catch(err => console.log(err));
    drctlist.value = result.data;
  };

 
</script>

<style>
  table , th, td {
    border: 2px, solid, black;
  }
</style>