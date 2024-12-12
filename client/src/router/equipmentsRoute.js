//설비 라우터
import checkSchdul from '@/views/equipments/checkSchdul.vue';

const equipmentsRoutes = [
    {
        path: '',
        redirect: { name : 'checkSchdul' }
    },
    {
        path: 'checkSchdul',
        name: 'checkSchdul',
        component: checkSchdul
    }
];

export default equipmentsRoutes;