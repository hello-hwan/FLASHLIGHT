<template>
    <div class="kiosk kiosk-drct">
      <div style="margin-bottom: 10px;
                  text-align: right;
                  height: 38px;">
      </div>
  
      <div>
          <!--요청 자재 상세목록-->
          <v-card
            class="mx-auto"
            style=" width: 100%;
                    border-bottom-right-radius: 13px;
                    border-bottom-left-radius: 13px;
                    display: inline-block;">
            <template v-slot:title>
              <span class="font-weight-black display-5">오늘의 할일</span>
            </template>
        
            <v-card-text class="bg-surface-light pt-4">
                <p class="display-5 text-lg-left font-weight-black">오전</p>
                <p class="display-6" v-for="aam in am" :key="aam.prdctn_code" :style="{backgroundColor : aam.color}" v-on:click="gotoNext(aam.prdctn_code, aam.color)">{{ aam.model_nm + ' 기계 - ' + aam.procs_nm + ' 작업 - ' + aam.prdctn_co + ' 개' }}</p>
                <div style="margin-bottom: 10px;
                  text-align: right;
                  height: 38px;"></div>
                <p class="display-5 text-lg-left font-weight-black">오후</p>
                <p class="display-6" v-for="ppm in pm" :key="ppm.prdctn_code" :style="{backgroundColor : ppm.color}" v-on:click="gotoNext(ppm.prdctn_code, ppm.color)">{{ ppm.model_nm + ' 기계 - ' + ppm.procs_nm + ' 작업 - ' + ppm.prdctn_co + ' 개' }}</p>

            </v-card-text>
          </v-card>
      </div>
  
  
    </div>
  </template>
  
<script setup>
  import { ref, onBeforeMount } from "vue";
  import axios from "axios";
  import { ajaxUrl } from '@/utils/commons.js';
  import { useRouter } from 'vue-router';
  import { useToast } from 'primevue/usetoast';
  
  const toast = useToast();
  const router = useRouter();
  
//   데이터 담을 변수
  const am = ref([]);
  const pm = ref([]);

//   데이터 가져오기
  const getlist = async () => {
    let result = await axios.get(`${ajaxUrl}/prod/drcttoday`)
                            .catch(err => console.log(err));

    let left = [];
    let right = [];
    for(let i = 0; i < result.data.length; i++){
        
        // 생산 중
        if(result.data[i].begin_time != null){
            result.data[i].color = '#fcde8d';
            //생산 완료
            if(result.data[i].end_time != null){
                result.data[i].color = '#96cff5';
            }

        } else {
            // 생산 시작 X
            result.data[i].color = '#959595';
        }
        let beginTime = new Date(result.data[i].pre_begin_time);
        let today = new Date(new Date().getFullYear() + '-' +(new Date().getMonth() + 1) + '-' + new Date().getDate());
        // 오늘 이전에 생산지시가 내려진 데이터들 오늘 오전으로 땡기기 
        // => 어제 오전에 했든 오후에 했든 시작시간으로 오전 오후 나누기 때문에 오전으로 땡김
        // (데이터를 땡기는게 아니라 조건문만)
        if(beginTime.getTime() < today.getTime()){
          beginTime.setHours(0);
          beginTime.setDate(today.getDate());
        }
        // 오후
        if(beginTime.getHours() >= 12 ){
            right.push(result.data[i]);
        } else {
            // 오전
            left.push(result.data[i]);
        }
    }
    am.value = left;
    pm.value = right;

  };
 

  const gotoNext = (code, color) => {
    if(color == '#96cff5'){
        // 작업 완료
        toast.add({ severity: 'warn', summary: '완료된 작업', detail: '이미 완료된 작업입니다.\n다시 실행할 수 없습니다.',life: 3000 });
        // router.push({ name : 'kioskState' , query : { code : code } });
        // router.push({ name : 'kioskStart' , query : { code : code } });
    } else if (color == '#fcde8d'){
      // 작업 중
      router.push({ name : 'kioskState' , query : { code : code } });
    } else {
        // 작업 시작 X
        router.push({ name : 'kioskStart' , query : { code : code } });
    }
  };
  
  onBeforeMount(()=> {
    getlist();
  })

</script>
<style scoped>
  .kiosk {
    max-width: 802mm;
    height: 1427mm;
    text-align: center;
  }

</style>