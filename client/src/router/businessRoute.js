//영업 라우터
import orderList from '@/views/business/orderList.vue';
import orderForm from '@/views/business/orderForm.vue';
import orderInfo from '@/views/business/orderInfo.vue';

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
    },
    {
        // 주문상세
        path: 'orderList/:order_no/:mtlty_name/:p_code',
        name: 'orderInfo',
        component: orderInfo
    }
]; 

export default businessRoutes;