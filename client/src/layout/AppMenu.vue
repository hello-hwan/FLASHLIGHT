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
                    },
                    {
                        label: '반품 리스트 등록',
                        to: '/'
                    },
                    {
                        label: '반품 리스트 조회',
                        to: '/'
                    },
                    {
                        label: '제품 재고 조정 등록',
                        to: '/'
                    },
                    {
                        label: '제품 재고 조정 조회',
                        to: '/'
                    },
                    {
                        label: '제품 재고 조정 수량',
                        to: '/'
                    },
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
                        to: '/'
                    },
                    {
                        label: '입고 관리',
                        to: '/materials/wrhousing'
                    },
                    {
                        label: '입고 조회',
                        to: '/'
                    },
                    {
                        label: '출고 관리',
                        to: '/materials/dlivy'
                    },
                    {
                        label: '출고 조회',
                        to: '/'
                    },
                    {
                        label: '조정 관리',
                        to: '/'
                    },
                    {
                        label: '조정 조회',
                        to: '/'
                    },
                    {
                        label: '반품 관리',
                        to: '/'
                    },
                    {
                        label: '반품 조회',
                        to: '/'
                    },
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
                        to: '/'
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
                        label: '점검 일정 현황',
                        to: '/'
                    },
                    {
                        label: '미점검 조회',
                        to: '/'
                    },
                    {
                        label: '점검 내역 조회',
                        to: '/'
                    },
                    {
                        label: '생산 오류 조회',
                        to: '/'
                    },
                    {
                        label: '미가동 조회',
                        to: '/'
                    },
                    {
                        label: '설비 관리',
                        to: '/'
                    },
                ]
            },  
            {
                label: '물류',
                items: [
                    {
                        label: '출고 조회',
                        to: '/'
                    },
                    {
                        label: '제품 출고 등록',
                        to: '/'
                    },
                    {
                        label: '제품 출고 관리',
                        to: '/'
                    },
                    {
                        label: '제품 입고 관리',
                        to: '/'
                    },
                    {
                        label: '제품 입고 조회',
                        to: '/'
                    },
                    {
                        label: '반품 입고 관리',
                        to: '/'
                    },
                    {
                        label: '반품 입고 조회',
                        to: '/'
                    },
                    {
                        label: '반제품 입고 관리',
                        to: '/logistics/prductNList'
                    },
                    {
                        label: '반제품 입고 조회',
                        to: '/'
                    },
                    {
                        label: '반제품 출고 관리',
                        to: '/'
                    },
                    {
                        label: '반제품 출고 조회',
                        to: '/'
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
                        to: '/'
                    },
                    {
                        label: '부서 관리',
                        to: '/'
                    },
                    {
                        label: '거래처 관리',
                        to: '/'
                    },
                    {
                        label: '거래처 조회',
                        to: '/'
                    },
                    {
                        label: '제품 관리',
                        to: '/'
                    },
                    {
                        label: '제품 조회',
                        to: '/'
                    },
                    {
                        label: '반제품 관리',
                        to: '/standardInfo/prductNdlivyList'
                    },
                    {
                        label: '반제품 조회',
                        to: '/standardInfo/prductNDlivyModar'
                    },
                    {
                        label: '자재 관리',
                        to: '/standardInfo/prductNListwrhousng'
                    },
                    {
                        label: '자재 조회',
                        to: '/standardInfo/prductNList'
                    }, 
                    {
                        label: 'BOM 관리',
                        to: '/standardInfo/bomList'
                    },
                    {
                        label: 'BOM 조회',
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
