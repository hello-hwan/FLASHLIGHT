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
            <span class="font-weight-black display-5">완료 보고</span>
          </template>
      
          <v-card-text class="bg-surface-light pt-4">
            <div style="margin-bottom: 10px;
                text-align: right;
                height: 50px;"></div>
            <p class="display-6">{{ datetime }}</p>
            <br>
            <p class="display-6">{{ '기계\t' + info.model_nm + '\t\t공정명\t' + info.procs_nm + '\t\t수량\t' + info.prdctn_co + '개' }}</p>
            <br>
            <p class="display-6">{{ '작업자 : ' + info.empl_nm }}</p>
            <div style="margin-bottom: 10px;
                text-align: right;
                height: 38px;"></div>
            <div class="float-left text-lg-center" style="width: 50%;">
              <label class="display-6 font-weight-black">생산자</label>
              <br>
              <Number v-model="empl"></Number>
              <div style="margin-bottom: 10px;
                            text-align: right;
                                height: 38px;">
              </div>
              <label class="display-6 font-weight-black">양품</label>
              <br>
              <Number v-model="nrmlt"></Number>
              <div style="margin-bottom: 10px;
                            text-align: right;
                                height: 38px;">
              </div>
              <label class="display-6 font-weight-black">불량품</label>
              <br>
              <Number v-model="badn"></Number>
              <br>
              <select class="kiosk-bad kiosk-select display-6 font-weight-black" id="bad" v-model="badty">
                <option value="" disabled hidden selected>불량 사유</option>
                <option v-for="ty in select" :key="ty.id" :value="ty.value">{{ ty.value }}</option>
              </select>
              <button type="button" class="kiosk-bad back-orange display-6 font-weight-black" @click="insbad">불량품 보고</button>
            </div>

            <div class="float-right align-left" style="width: 50%;">
              <div v-for="mt in matril" :key="mt.mtril_code">
                <label class="display-6 font-weight-black">{{ mt.mtril_nm }}</label>
                <br>
                <Number v-model="mt.usage"></Number>
                <div style="margin-bottom: 10px;
                            text-align: right;
                                height: 38px;">
              </div>
              </div>
              <p v-if="matril.length == 0" class="font-weight-black display-6">재료 미사용</p>
            </div>
            <div class="clearfix">
              <div style="margin-bottom: 10px;
                            text-align: right;
                                height: 38px;">
              </div>
            </div>


            <button type="button" class="kiosk-btn back-blue display-6 font-weight-black" @click="finishstate">제출</button>
            <button type="button" class="kiosk-btn back-red display-6 font-weight-black" @click="gotoback()">뒤로가기</button>
          </v-card-text>
        </v-card>
    </div>


  </div>
</template>

<script setup>
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import { ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from 'vue-router';
import useDates from "@/utils/useDates";
import { useToast } from 'primevue/usetoast';
import Number from "@/components/kiosk/Number.vue";

const value = ref([]);

// 알림창
const toast = useToast();

//   toast.add({ severity: 'warn', summary: '자재부족', detail: '자재가 부족합니다\n재고를 확인해주세요.', life: 3000 });
//   toast.add({ severity: 'success', summary: '출고 성공', detail: '처리가 완료되었습니다.', life: 3000 });
//   toast.add({ severity: 'error', summary: '출고 실패', detail: '문제가 생겼습니다.\n관리자에게 문의해주세요.', life: 3000 });

// 라우터 변수
const route = useRoute();
const router = useRouter();


// 데이터 담을 변수
const info = ref({});
const matril = ref([]);
const empl = ref('');
const nrmlt = ref('');
const badn = ref('');
const badty = ref('');
const datetime = ref(useDates.dateFormat(null, 'yyyy-MM-dd') + useDates.timeFormat(null, ' hh:mm:ss'));
const select = ref([]);

// 시간 실시간 변경
const getday = () => {
  let date = new Date();
  datetime.value = useDates.dateFormat(date, 'yyyy-MM-dd') + useDates.timeFormat(date, ' hh:mm:ss');
}

// 생산지시 정보 조회
const getinfo = async (code) => {
  let result = await axios.get(`${ajaxUrl}/prod/stateinfo/${code}`)
                          .catch(err => console.log(err));
  info.value = result.data;
  getmatril(result.data.procs_code);
};


// 공정흐름도에서 소모자재 조회
const getmatril = async (code) => {
  let result = await axios.get(`${ajaxUrl}/prod/selmatrl/${code}`)
  // let result = await axios.get(`${ajaxUrl}/prod/selmatrl/aaa1-1`)
                          .catch(err => console.log(err));
  matril.value = result.data;
};


// 뒤로가기 함수
const gotoback = async () => {
  router.push({ name : 'kioskMain' });
};

// 불량품 보고 함수
const insbad = async () => {
  // 사원 번호 다르면 보고 불가
  if(empl.value != info.value.empl_no){
    toast.add({ severity: 'warn', summary: '사원 번호 오류', detail: '사원 번호가 다릅니다. \n 사원번호를 다시 입력해주세요.', life: 3000 });
    return;
  }
  // 불량 사유 미입력
  if(!badty.value){
    toast.add({ severity: 'warn', summary: '사유 미입력', detail: '불량 사유를 선택하세요.', life: 3000 });
  } else if (!badn.value){
    // 불량 수량 미입력
    toast.add({ severity: 'warn', summary: '불량 수량 미입력', detail: '불량 수량을 입력하세요.', life: 3000 });
  } else {
    // 정상 실행
    let result = await axios.post(`${ajaxUrl}/prod/addbad`, { "badn_qy" : badn.value, "badn_ty" : badty.value, "prdctn_code" : info.value.prdctn_code })
                            .catch(err => console.log(err));
    // 삽입 성공시
    if(result.data.retCode == 1){
      toast.add({ severity: 'success', summary: '보고 성공', detail: '불량품 보고 처리가 완료되었습니다.', life: 3000 });
    } else {
      // 삽입 실패시
      toast.add({ severity: 'error', summary: '보고 실패', detail: '불량품 보고 처리에 실패했습니다.\n다시 시도해주세요.', life: 3000 });
    }
  }
};

// 생산 완료 보고 
const finishstate = async () => {
  // 사원 번호 다르면 보고 불가
  if(empl.value != info.value.empl_no){
    toast.add({ severity: 'warn', summary: '사원 번호 오류', detail: '사원 번호가 다릅니다. \n 사원번호를 다시 입력해주세요.', life: 3000 });
    return;
  }
  // 양품 입력 안하면 보고 불가
  if(!nrmlt.value){
    toast.add({ severity: 'warn', summary: '양품 수량 미입력', detail: '양품 수량을 입력하세요.', life: 3000 });
    return;
  }
  // 소모 재료 없을 때
  if(matril.value.length == 0){
    let result = await axios.put(`${ajaxUrl}/prod/updstate/no`, { "end_time" : datetime.value, "nrmlt" : nrmlt.value, "prdctn_code" : info.value.prdctn_code })
                            .catch(err => console.log(err));
    if(result.data.retCode == 1){
      toast.add({ severity: 'success', summary: '제출 성공', detail: '생산완료 보고 처리가 완료되었습니다.', life: 3000 });
      router.push({ name : 'kioskMain' });
    } else {
      toast.add({ severity: 'error', summary: '제출 실패', detail: '생산완료 보고 처리에 실패했습니다.\n다시 시도해주세요.', life: 3000 });
    }
  } else {
    // 소모 재료 있을 때
    let checkisnull = false;
    for(let i = 0; i < matril.value.length; i++){
      if(!matril.value[i].usage){
        checkisnull = true;
      }
    }
    // 소모량 입력 안하면 보고 불가
    if(checkisnull){
      toast.add({ severity: 'warn', summary: '사용 재료 미입력', detail: '재료 수량을 모두 입력하세요.', life: 3000 });
      return;
    }
    let result = await axios.put(`${ajaxUrl}/prod/updstate/yes`, { "prdctn_code" : info.value.prdctn_code, "matril": matril.value })
                            .catch(err => console.log(err));
    if(result.data.retCode == 1){
      let anoresult = await axios.put(`${ajaxUrl}/prod/updstate/no`, { "end_time" : datetime.value, "nrmlt" : nrmlt.value, "prdctn_code" : info.value.prdctn_code })
                                 .catch(err => console.log(err));
      if(anoresult.data.retCode == 1){
        toast.add({ severity: 'success', summary: '제출 성공', detail: '생산완료 보고 처리가 완료되었습니다.', life: 3000 });
        setTimeout(() => {
          router.push({ path : 'kioskMain' });
        }, 1000);
      } else {
        toast.add({ severity: 'error', summary: '제출 실패', detail: '생산완료 보고 처리에 실패했습니다.\n다시 시도해주세요.', life: 3000 });
      }
    } else {
      toast.add({ severity: 'error', summary: '제출 실패', detail: '생산완료 보고 처리에 실패했습니다.\n다시 시도해주세요.', life: 3000 });
    }

  }
};



onBeforeMount(() => {
  let selcode = route.query.code;
  getinfo(selcode);
  setInterval(getday, 1000);
  select.value = [{id : 1, value : "본인 과실"}, {id : 2, value : "기계 결함"}, {id : 3, value : "기타"} ]
});


</script>
<style scoped>
  .kiosk-btn {
    width: 25%;
    height: 100px;
    margin: 5%;
  }
  .back-orange {
    background-color: rgb(248, 228, 191);
  }
  .back-blue{
    background-color: rgb(166, 202, 243);
  }
  .back-red{
    background-color: rgb(252, 196, 196);
  }
  .kiosk-bad {
    width: 45%;
    height: 100px;
    margin: 2%;
    display: inline;
  }
  .kiosk-select {
   appearance: auto;
   background-color: white;
   height: 50px;
  }

</style>