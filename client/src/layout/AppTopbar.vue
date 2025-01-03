
<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <span>FlashLight</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <!-- <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                
            </div> -->

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <input v-model="empName" style="color:white; width:80px;"></input>
                    <button type="button" class="layout-topbar-action" @click="logOut">
                        <i class="pi pi-fw pi-sign-in"></i>
                        <span>로그아웃</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref } from 'vue';
import {useRouter} from 'vue-router';


import { useStore } from 'vuex'; // Vuex 스토어 가져오기
const store = useStore();
const router = useRouter();

const { toggleMenu } = useLayout();

let empName = ref(store.state.empInfo[store.state.empInfo.length-1].name + " 님");

const logOut = () => {
    if(store.state.empInfo[store.state.empInfo.length-1].name != null) {
        store.dispatch('removeInfo');
        router.push({path: '/login'});
    };
};


</script>
