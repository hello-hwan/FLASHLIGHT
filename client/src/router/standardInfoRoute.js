//기준정보 라우터
import bomList from "@/views/standardInfo/bomList.vue";
import bomManage from "@/views/standardInfo/bomManage.vue";
import prductNDlivyModar from "@/views/standardInfo/prduct_n_dlivy_modar.vue"

const standardInfoRoute = [
    {
        path: '',
        redirect: { name : 'bomList' }
    },
    {
        path: 'bomList',
        name: 'bomList',
        component: bomList
    },
    {
        path: 'bomManage',
        name: 'bomManage',
        component: bomManage
    },
    {
        path: 'prductNDlivyModar',
        name: 'prductNDlivyModar',
        component: prductNDlivyModar
    },

];

export default standardInfoRoute;
