//import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

//view
import testVuetify from '@/views/vuetifyTest.vue';
import businessApp from '@/views/business/businessApp.vue';
import equipmentsApp from '@/views/equipments/equipmentsApp.vue';
import logisticsApp from '@/views/logistics/logisticsApp.vue';
import materialsApp from '@/views/materials/materialsApp.vue';
import productionApp from '@/views/production/productionApp.vue';
import qualityApp from '@/views/quality/qualityApp.vue';
import standardInfoApp from '@/views/standardInfo/standardInfoApp.vue';
import statisticsApp from '@/views/statistics/statisticsApp.vue';

//router
import businessRoutes from '@/router/businessRoute';
import equipmentsRoutes from '@/router/equipmentsRoute.js';
import logisticsRoutes from '@/router/logisticsRoute.js';
import materialsRoutes from '@/router/materialsRoute.js';
import productionRoutes from '@/router/productionRoute.js';
import qualityRoutes from '@/router/qualityRoute.js';
import standardInfoRoutes from '@/router/standardInfoRoute.js';
import statisticsRoutes from '@/router/statisticsRoute.js';

/*
  영업부서 사원 - 주문 조회 ( SA-101 ) orderList.vue
  자재부서 사원 - 자재 재고 조회(MT-011) materialQy.vue
  생산부서 사원 - 관리자 생산 메인 페이지(PD-001) productionMain.vue
  품질부서 사원 - 풀질검사요청(QC-401) qualityRequest.vue
  물류부서 사원 - 출고예정재품 조회(WMS-600) deliveryPrearnge.vue
  설비부서 사원 - 점검 일정( FC-501 ) checkSchdul.vue
  통계 - 기간별 생산량 (statistics-700) outturn.vue
  기준정보 - (화면 번호 미정) 제품조회 productlist.vue
*/

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect : {name: 'testVuetify'}
          },
          {
            path: '/test',
            name: 'testVuetify',
            component: testVuetify
          },
          {
            path: '/business',
            name: 'businessApp',
            component: businessApp,
            children : businessRoutes
          },
          {
            path: '/equipments',
            name: 'equipmentsApp',
            component: equipmentsApp,
            children : equipmentsRoutes
          },
          {
            path: '/logistics',
            name: 'logisticsApp',
            component: logisticsApp,
            children : logisticsRoutes
          },
          {
            path: '/materials',
            name: 'materialsApp',
            component: materialsApp,
            children : materialsRoutes
          },
          {
            path: '/production',
            name: 'productionApp',
            component: productionApp,
            children : productionRoutes
          },
          {
            path: '/quality',
            name: 'qualityApp',
            component: qualityApp,
            children : qualityRoutes
          },
          {
            path: '/standardInfo',
            name: 'standardInfoApp',
            component: standardInfoApp,
            children : standardInfoRoutes
          },
          {
            path: '/statistics',
            name: 'statisticsApp',
            component: statisticsApp,
            children : statisticsRoutes
          },
    ]
});

export default router;
