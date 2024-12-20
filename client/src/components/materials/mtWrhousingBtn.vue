<template>
    <Button @click="onButtonClicked" label="입고" severity="success" />
</template>

<script setup>
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

const toast = useToast();
const props = defineProps(['params']);

async function onButtonClicked() {
    //부모 컴포넌트로부터 가져온 데이터
    console.log(props.params.data);
    let data = props.params.data;
    console.log('******확인: ', data)
    //전송할 데이터 객체 생성
    let obj = {
        mtril_check_code : data.checkCode == null ? 'none' : data.checkCode,
        mtril_name : data.name,
        mtril_code : data.code,
        mtril_qy : data.qy,
        wrhousng_se : data.checkCode == null ? '반환' : '발주',
        empl_no: 100,   //로그인 정보 바탕으로 사원번호 가져오기 아직 구현되지 않음
        wrhousng_date: userDateUtils.dateFormat(data.wrdate, 'yyyy-MM-dd'),
        mtril_lot: data.lot == null ? '0' : data.lot
    }

    //등록
    let result = await axios.post(`${ajaxUrl}/mtril/mtWrhous`, obj)
                               .catch(err => console.log(err));
    let addRes = result;
    console.log(addRes.data);

    //삭제
    props.params.api.applyTransaction({
        remove: [props.params.node.data]
    });

    if(addRes.data = 'success') {
        //처리 완료 안내
        toast.add({ severity: 'success', summary: '성공', detail: '처리가 완료되었습니다.', life: 3000 });

    } else {
        //처리 실패 안내
        toast.add({ severity: 'warn', summary: '실패', detail: '문제가 생겼습니다.\n관리자에게 문의해주세요.', life: 3000 });
    }
   

}

</script>