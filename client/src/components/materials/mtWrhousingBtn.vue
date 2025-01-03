<template>
    <button @click="onButtonClicked" class="btn btn-primary" style="line-height: 0;" >입고</button>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';
import { useStore } from 'vuex'; // Vuex 스토어 가져오기
const store = useStore();
let empId = store.state.empInfo[store.state.empInfo.length-1].user_id;

const toast = useToast();
const props = defineProps(['params']);

async function onButtonClicked() {
    //부모 컴포넌트로부터 가져온 데이터
    //console.log(props.params.data);
    let data = props.params.data;
    //console.log('******확인: ', data)
    //전송할 데이터 객체 생성
    let obj = {
        mtril_check_code : data.checkCode == null ? 'none' : data.checkCode,
        mtril_name : data.name,
        mtril_code : data.code,
        mtril_qy : data.qy,
        wrhousng_se : data.checkCode == null ? 'MW02' : 'MW01',
        empl_no: empId,
        wrhousng_date: userDateUtils.dateFormat(data.wrdate, 'yyyy-MM-dd'),
        mtril_lot: data.lot == null ? 'none' : data.lot
    };
    console.log(obj);
    //등록
    let result = await axios.post(`${ajaxUrl}/mtril/mtWrhous`, obj)
                               .catch(err => console.log(err));
    let addRes = result;

    //결과가 1이 리턴되면 성공
    //console.log('등록성공여부: ', addRes.data[0][0].result);
    if(addRes.data[0][0].result == '1') {
        //처리 완료 안내
        toast.add({ severity: 'success', summary: '성공', detail: '처리가 완료되었습니다.', life: 3000 });
        //화면에서 삭제
        props.params.api.applyTransaction({remove: [props.params.node.data]});
    } else {
        //처리 실패 안내
        toast.add({ severity: 'warn', summary: '실패', detail: '문제가 생겼습니다.\n관리자에게 문의해주세요.', life: 3000 });
    };
   

}

</script>