//자재 라우터
import mttest from '@/views/materials/testmt.vue';
//재고 조회
import mtrilQy from '@/views/materials/materialQy.vue';
//자재 입고
import mtWrhousingCnt from '@/views/materials/mtWrhousingCnt.vue';
//자재 출고
import mtdlivyCnt from '@/views/materials/delivyCnt.vue';

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
    
];

export default materialsRoute;