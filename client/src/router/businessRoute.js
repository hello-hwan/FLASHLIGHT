//영업 라우터
import orderList from '@/views/business/orderList.vue';
import orderForm from '@/views/business/orderForm.vue';

const businessRoutes = [
    {
        path: '',
        redirect : { name : 'orderList'}
    },
    {
        // 주문조회
        path: 'orderList',
        name: 'orderList',
        component: orderList
    },
    {
        // 주문등록
        path: 'orderForm',
        name: 'orderForm',
        component: orderForm
    }
]; 

export default businessRoutes;