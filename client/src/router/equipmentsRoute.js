//설비 라우터
import eqpList from '@/views/equipments/eqpList.vue';
import checkSchdul from '@/views/equipments/checkSchdul.vue';
import chechfxlist from '@/views/equipments/chechfxlist.vue';
import notChckList from '@/views/equipments/notChckList.vue';
import eqpAllList from '@/views/equipments/eqpAllList.vue';
import addEqp from '@/views/equipments/addEqp.vue';
import notOprList from '@/views/equipments/notOprList.vue';

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
    {
        path: 'notChckList',
        name: 'notChckList',
        component: notChckList
    }, 
    {
        path: 'eqpAllList',
        name: 'eqpAllList',
        component: eqpAllList
    }, 
    {
        path: 'addEqp',
        name: 'addEqp',
        component: addEqp
    }, 
    {
        path: 'notOprList',
        name: 'notOprList',
        component: notOprList
    }
];

export default equipmentsRoutes;