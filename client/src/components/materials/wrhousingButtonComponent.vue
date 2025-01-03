<template>
    <!--입고 처리 버튼 컴포넌트-->
    <button type="button" 
        class="btn btn-primary" 
        @click="onButtonClicked"
        style="color: #fff; height: 30px;
        line-height: 0.3;
        width: 100px;">
        입고
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
                wrhousng_date: userDateUtils.dateFormat(data.wrdate, 'yyyy-MM-dd'),
                mtril_lot: data.lot == null ? '0' : data.lot
            }
            console.log(obj);
            //입고테이블에 인서트
            
            let result = await axios.post(`${ajaxUrl}/mtril/mtWrhous`, obj)
                               .catch(err => console.log(err));
            let addRes = result;
            console.log(addRes);

            //삭제
            this.params.api.applyTransaction({
                remove: [this.params.node.data]
            });

            //삭제완료 출력
            this.showSuccess();
        },
        showSuccess() {
            toast.add({ severity: '입', summary: 'Success Message', detail: 'Message Detail', life: 3000 });
        }
    }
};
</script>

<style>
button {
    height: 30px;
    line-height: 1;
}
.btn-primary {
    --bs-btn-color: #fff;
    --bs-btn-bg: #1bc95b;
    --bs-btn-border-color: #1bc95b;
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: #11813a;
    --bs-btn-hover-border-color: #11813a;
    --bs-btn-focus-shadow-rgb: 49, 132, 253;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: #11813a;
    --bs-btn-active-border-color: #11813a;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #fff;
    --bs-btn-disabled-bg: #11813a;
    --bs-btn-disabled-border-color: #11813a;
}

</style>