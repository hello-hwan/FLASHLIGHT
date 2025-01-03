<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';


const model = ref([
    {
        label: ' ',
        items: [
            {
                label: '영업',
                items: [
                    {
                        label: '주문 요청 등록',
                        to: '/business/orderForm'
                    },
                    {
                        label: '주문 요청 조회',
                        to: '/business/orderList'
                    }
                ]
            },
            {
                label: '자재',
                items: [
                    {
                        label: '재고 조회',
                        to: '/materials/mtrilQy'
                    },
                    {
                        label: '발주 관리',
                        to: '/materials/mtOrder'
                    },
                    {
                        label: '발주 조회',
                        to: '/materials/mtOrderInquiry'
                    },
                    {
                        label: '입고 관리',
                        to: '/materials/wrhousing'
                    },
                    {
                        label: '입고 조회',
                        to: '/materials/mtWrhousingList'
                    },
                    {
                        label: '출고 관리',
                        to: '/materials/dlivy'
                    },
                    {
                        label: '출고 조회',
                        to: '/materials/mtDlivyList'
                    }
                ]
            },
            {
                label: '생산',
                items: [
                    {
                        label: '생산 계획 안내',
                        to: '/production'
                    },
                    {
                        label: '공장 실적 조회',
                        to: '/production/productionResult'
                    },
                    {
                        label: '키오스크',
                        to: '/kiosk'
                    }
                ]
            },
            {
                label: '품질',
                items: [
                    {
                        label: '품질 검사 요청',
                        to: '/quality/qualityRequest'
                    },                   
                    {
                        label: '품질 검사 결과',
                        to: '/quality/qiResult'
                    }
                ]
            },
            {
                label: '설비',
                items: [
                    {
                        label: '설비 상태 조회',
                        to: '/equipments/eqpList'
                    },
                    {
                        label: '점검 일정',
                        to: '/equipments/checkSchdul'
                    },
                    {
                        label: '미점검 조회',
                        to: '/equipments/notChckList'
                    },
                    {
                        label: '미가동 조회',
                        to: '/equipments/notOprList'
                    },
                    {
                        label: '설비 관리',
                        to: '/equipments/eqpAllList'
                    },
                ]
            },  
            {
                label: '물류',
                items: [
                    {
                        label: '제품 출고 조회',
                        to: '/logistics/prductDlivyList'
                    },
                    {
                        label: '제품 출고 관리',
                        to: '/logistics/prductDlivy'
                    },
                    {
                        label: '제품 입고 관리',
                        to: '/logistics/prductWrhousngList'
                    },
                    {
                        label: '제품 입고 조회',
                        to: '/logistics/prductList'
                    },
                    {
                        label: '반제품 입고 관리',
                        to: '/logistics/prductNWrhousngList'
                    },
                    {
                        label: '반제품 입고 조회',
                        to: '/logistics/prductNList'
                    },
                    {
                        label: '반제품 출고 관리',
                        to: '/logistics/prductNDlivy' 
                    },
                    {
                        label: '반제품 출고 조회',
                        to: '/logistics/prductNDlivyList'
                    },
                ]
            },   
            {
                label: '통계',
                items: [
                    {
                        label: '기간별 생산량',
                        to: '/'
                    },
                    {
                        label: '출고율',
                        to: '/'
                    },
                    {
                        label: '불량률 조회',
                        to: '/'
                    }
                ]
            },   
            {
                label: '기준 정보',
                items: [
                    {
                        label: '사원 관리',
                        to: '/standardInfo/emplManagement'
                    },
                    {
                        label: '거래처 관리',
                        to: '/'
                    },
                    {
                        label: '거래처 조회',
                        to: '/standardInfo/infobcncList'
                    },
                    {
                        label: '제품 관리 / 제품 조회',
                        to: '/standardInfo/infoprductList'
                    },
                    {
                        label: '반제품 관리 / 반제품 조회',
                        to: '/standardInfo/infoprductNList'
                    },
                    {
                        label: '자재 관리 / 자재 조회',
                        to: '/standardInfo/mtrilList'
                    }, 
                    {
                        label: 'BOM 관리 / BOM 조회',
                        to: '/standardInfo/bomList'
                    },
                    {
                        label: '공정 흐름도 관리',
                        to: '/standardInfo/procsFlowchartinsert'
                    },
                    {
                        label: '공정 흐름도 조회',
                        to: '/standardInfo/procsFlowchartList'
                    },
                    {
                        label: '품질 검사 항목 관리',
                        to: '/standardInfo/qiList'
                    },
                ]
            },  
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
