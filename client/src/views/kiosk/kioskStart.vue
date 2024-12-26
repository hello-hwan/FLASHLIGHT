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
            <span class="font-weight-black display-5">시작 보고</span>
          </template>
      
          <v-card-text class="bg-surface-light pt-4">
            <div style="margin-bottom: 10px;
                text-align: right;
                height: 50px;"></div>
            <p class="display-6">{{ datetime }}</p>
            <br>
            <p class="display-6">{{ info.model_nm + ' 기계 - ' + info.procs_nm + ' 작업 - ' + info.prdctn_co + ' 개' }}</p>
            <div style="margin-bottom: 10px;
                text-align: right;
                height: 38px;"></div>
            <p v-for="mt in matril" :key="mt.mtril_code">{{ mt.mtril_nm + ' ' + mt.usgqty + '개 사용 예정' }}</p>
            <p v-if="matril.length == 0" class="font-weight-black display-6">원자재 미사용</p>
            <div style="margin-bottom: 10px;
                text-align: right;
                height: 38px;"></div>
            <label for="empl_no" class="display-6">생산자</label>
            <input type="text" id="empl_no" v-model="empl" class="display-6 text-lg-right" style="background-color: white; margin-left: 5%;" @click="gotoNumber()">
            <div style="margin-bottom: 10px;
                text-align: right;
                height: 38px;"></div>

            <button type="button" class="kiosk-btn back-blue display-6 font-weight-black" @click="gotostart(empl)">시작</button>
            <button type="button" class="kiosk-btn back-red display-6 font-weight-black" @click="gotoback()">뒤로가기</button>
            <br>
            <button type="button" class="kiosk-btn back-green display-6 font-weight-black" @click="gotoshift()">공정이동표</button>

          </v-card-text>
        </v-card>
    </div>


  </div>
</template>

<script setup>
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import { ref, onBeforeMount, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
import useDates from "@/utils/useDates";
import { useToast } from 'primevue/usetoast';

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
const datetime = ref(useDates.dateFormat(null, 'yyyy-MM-dd') + useDates.timeFormat(null, ' hh:mm:ss'));

// 시간 실시간 변경
const getday = () => {
  let date = new Date();
  datetime.value = useDates.dateFormat(date, 'yyyy-MM-dd') + useDates.timeFormat(date, ' hh:mm:ss');
}

// 생산지시 정보 조회
const getinfo = async (code) => {
  let result = await axios.get(`${ajaxUrl}/prod/onedrct/${code}`)
                          .catch(err => console.log(err));
  info.value = result.data;
  console.log(info.value.prdctn_code);
  getmatril(result.data.procs_code);

};

// 공정흐름도에서 소모자재 조회
const getmatril = async (code) => {
  let result = await axios.get(`${ajaxUrl}/prod/selmatrl/${code}`)
                          .catch(err => console.log(err));
  matril.value = result.data;
};

// 시작 함수
const gotostart = async (empl) => {
  if(empl.length == 0){
    toast.add({ severity: 'warn', summary: '생산자 미입력', detail: '사원번호를 입력해주세요.', life: 3000 });
    return;
  }
  let result = await axios.post(`${ajaxUrl}/prod/addstate`, { "prdctn_code" : info.prdctn_code, })
                          .catch(err => console.log(err));

  router.push({ name : 'kioskMain' });
};


// 뒤로가기 함수
const gotoback = async () => {
  router.push({ name : 'kioskMain' });
};

// 공정이동표 함수
const gotoshift = async () => {

};

const gotoNumber = async () => {

};


onBeforeMount(() => {
  let selcode = route.query.code;
  getinfo(selcode);
  setInterval(getday, 1000);
});


</script>
<style>
  .kiosk-btn {
    width: 25%;
    height: 100px;
    margin: 5%;
  }
  .back-green {
    background-color: rgb(205, 240, 205);
  }
  .back-blue{
    background-color: rgb(166, 202, 243);
  }
  .back-red{
    background-color: rgb(252, 196, 196);
  }

</style>