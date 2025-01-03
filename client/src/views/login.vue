<template>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, #344461 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <!-- <img src="../../public/flashLight.png" style="margin:0 auto; width:200px; height:200px"> -->

                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">로그인</div>
                        <!-- <span class="text-muted-color font-medium">로그인</span> -->
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">사원번호</label>
                        <InputText id="email1" type="text" placeholder="" class="w-full md:w-[30rem] mb-8" v-model="empId" v-on:keyup.enter="login" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">비밀번호</label>
                        <Password id="password1" v-model="emplPassword" placeholder="" :toggleMask="true" class="mb-4" fluid :feedback="false" v-on:keyup.enter="login"></Password>

                        <!-- <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="로그인 상태 유지"></label>
                            </div>
                        </div> -->
                        <Button label="로그인" class="w-full login-btn" @click="login"></Button>
                    </div>
                </div>
            </div>
        </div>
        <Toast />
    </div>
</template>


<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons';
import {useRouter} from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex'; // Vuex 스토어 가져오기


const store = useStore();

const toast = useToast();
const router = useRouter();

//아이디, 비밀번호
const empId = ref('');
const emplPassword = ref('');
try {
    if(store.state.empInfo[store.state.empInfo.length-1].name != null) {
        switch(store.state.empInfo[store.state.empInfo.length-1].dept_se) {
            case 'DP01' : 
                //DP01 영업사원
                router.push({path: '/business'});
                break;
            case 'DP02' : 
                //DP02 품질사원
                router.push({path: '/quality'});
                break;
            case 'DP03' : 
                //DP03 자재사원
                router.push({path: '/materials'});
                break;
            case 'DP04' : 
                //DP04 물류사원
                router.push({path: '/logistics'});
                break;
            case 'DP05' : 
                //DP05 생산사원
                router.push({path: '/production'});
                break;
            case 'DP06' : 
                //DP06 설비사원
                router.push({path: '/equipments'});
                break;
        };
    };
} catch {

};

const login = async() => {
    let loginObj = {empl_no: empId.value, password: emplPassword.value};
    let result = await axios.post(`${ajaxUrl}/login`, loginObj)
                            .catch(err=> console.log(err));

    console.log(result);
    if(result.data.length == 0) {
        //로그인이 안된경우
        toast.add({ severity: 'warn', summary: '로그인 실패', detail: '아이디, 비밀번호를 확인해주세요', life: 3000 });
        empId.value = '';
        emplPassword.value = '';
    } else {
        let empInfo = {user_id: result.data[0].empl_no, dept_se: result.data[0].dept_se, name: result.data[0].empl_name }
        store.dispatch('addInfo', empInfo);

        switch(result.data[0].dept_se) {
            case 'DP01' : 
                //DP01 영업사원
                router.push({path: '/business'});
                break;
            case 'DP02' : 
                //DP02 품질사원
                router.push({path: '/quality'});
                break;
            case 'DP03' : 
                //DP03 자재사원
                router.push({path: '/materials'});
                break;
            case 'DP04' : 
                //DP04 물류사원
                router.push({path: '/logistics'});
                break;
            case 'DP05' : 
                //DP05 생산사원
                router.push({path: '/production'});
                break;
            case 'DP06' : 
                //DP06 설비사원
                router.push({path: '/equipments'});
                break;
        };
    }
}

</script>


<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
.login-btn {
    margin-top: 30px;
}
.p-button {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    color: var(--p-button-primary-color);
    background: #2c4f91;
    border: 1px solid #2c4f91;
    font-size: 1rem;
    font-family: inherit;
    font-feature-settings: inherit;
    transition: background var(--p-button-transition-duration), color var(--p-button-transition-duration), border-color var(--p-button-transition-duration), outline-color var(--p-button-transition-duration), box-shadow var(--p-button-transition-duration);
    border-radius: var(--p-button-border-radius);
    outline-color: transparent;
    gap: var(--p-button-gap);
}
.p-button:not(:disabled):hover {
    background: #2c4f91;
    border: 1px solid #2c4f91;
    color: var(--p-button-primary-hover-color);
}
</style>
