//테스트
import mttest from '@/views/materials/testmt.vue';
//pdf 테스트
import testPdf from '@/views/materials/pdfTest.vue';
//재고 조회
import mtrilQy from '@/views/materials/materialQy.vue';
//자재 입고
import mtWrhousingCnt from '@/views/materials/mtWrhousingControl.vue';
//자재 출고
import mtdlivyCnt from '@/views/materials/mtDelivyControl.vue';
//발주 관리
import mtOrderCnt from '@/views/materials/mtOrderControl.vue';
//발주 조회
import mtOrderInquiry from '@/views/materials/mtOrderInquiry.vue';
//입고 조회
import mtWrhousingList from '@/views/materials/mtWrhousingList.vue';
//출고 조회
import mtDlivyList from '@/views/materials/mtDlivyList.vue';

const materialsRoute = [
    {
        path: '',
        redirect : { name : 'mtrilQy' }
    },
    {
        path: 'mttest',
        name: 'mttest',
        component: mttest

    },
    {
        path: 'pdf',
        name: 'pdf',
        component: testPdf
    },
    {
        path: 'mtrilQy',
        name: 'mtrilQy',
        component: mtrilQy
    },
    {
        path: 'wrhousing',
        name: 'wrhousing',
        component: mtWrhousingCnt
    },
    {
        path: 'dlivy',
        name: 'dlivy',
        component: mtdlivyCnt
    },
    {
        path: 'mtOrder',
        name: 'mtOrder',
        component: mtOrderCnt
    },
    {
        path: 'mtOrderInquiry',
        name: 'mtOrderInquiry',
        component: mtOrderInquiry
    },
    {
        path: 'mtWrhousingList',
        name: 'mtWrhousingList',
        component: mtWrhousingList
    },
    {
        path: 'mtDlivyList',
        name: 'mtDlivyList',
        component: mtDlivyList
    },
];

export default materialsRoute;