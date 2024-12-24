//기준정보 라우터
import bomList from "@/views/standardInfo/bomList.vue";

import bomInsert from "@/views/standardInfo/bomInsert.vue";

import procsFlowchartList from "@/views/standardInfo/procsFlowchartList.vue";
import procsFlowchartDetail from "@/views/standardInfo/procsFlowchartDetail.vue";
import procsFlowchartinsert from "@/views/standardInfo/procsFlowchartinsert.vue";

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

        path: 'bomInsert',
        name: 'bomInsert',
        component: bomInsert
    }, 
    {
        path: 'procsFlowchartList',
        name: 'procsFlowchartList',
        component: procsFlowchartList
    },
    {
        path: 'procsFlowchartDetail/:prd_code',
        name: 'procsFlowchartDetail',
        component: procsFlowchartDetail
    }, 
    {
        path: 'procsFlowchartinsert',
        name: 'procsFlowchartinsert',
        component: procsFlowchartinsert
    }

        path: 'bomManage',
        name: 'bomManage',
        component: bomManage
    },
    {
        path: 'prductNDlivyModar',
        name: 'prductNDlivyModar',
        component: prductNDlivyModar
    }


];

export default standardInfoRoute;
