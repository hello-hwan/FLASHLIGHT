<template>
    <button @click="onButtonClicked">
        {{ '입고' }}
    </button>
</template>

<script>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

export default {
    props: ["params"],
    methods: {
        async onButtonClicked() {
            // 버튼 클릭 시 현재 행의 데이터를 출력
            //console.log(this.params.data);
            
            let data = this.params.data;
            console.log(data);
            //전송할 데이터 객체
            let obj = {
                mtril_check_code : data.checkCode == null ? 'none' : data.checkCode,
                mtril_name : data.name,
                mtril_code : data.code,
                mtril_qy : data.qy,
                wrhousng_se : data.checkCode == null ? '반환' : '발주',
                empl_no: 100,   //로그인 정보 바탕으로 사원번호 가져오기 아직 구현되지 않음
                wrhousng_date: userDateUtils.dateFormat(data.wrdate, 'yyyy-MM-dd')
            }
            //console.log(obj);
            //입고테이블에 인서트
            /*
            let result = await axios.post(`${ajaxUrl}/mtWrhous`, obj)
                               .catch(err => console.log(err));
            let addRes = result;
            console.log(addRes);
            */
           //로트도 가져왔음
           //let data.lot

            //삭제
            this.params.api.applyTransaction({
                remove: [this.params.node.data]
            });
        }
    }
};
</script>