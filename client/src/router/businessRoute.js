//영업 라우터
import orderList from '@/views/business/orderList.vue';

const businessRoutes = [
    {
        path: '',
        redirect : { name : 'orderList'}
    },
    {
        path: 'orderList',
        name: 'orderList',
        component: orderList
    }
];

export default businessRoutes;