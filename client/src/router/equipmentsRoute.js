//설비 라우터
import eqpList from '@/views/equipments/eqpList.vue';
import checkSchdul from '@/views/equipments/checkSchdul.vue';
import chechfxlist from '@/views/equipments/chechfxlist.vue';

const equipmentsRoutes = [
    {
        path: '',
        redirect: { name : 'checkSchdul' }
    },
    {
        path: 'eqpList',
        name: 'eqpList',
        component: eqpList
    }, 
    {
        path: 'checkSchdul',
        name: 'checkSchdul',
        component: checkSchdul
    }, 
    {
        path: 'checkfxlist/:fx_code',
        name: 'checkfxlist',
        component: chechfxlist
    }, 
];

export default equipmentsRoutes;