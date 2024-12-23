//기준정보 라우터
import bomList from "@/views/standardInfo/bomList.vue";
import procsFlowchartList from "@/views/standardInfo/procsFlowchartList.vue";
import procsFlowchartDetail from "@/views/standardInfo/procsFlowchartDetail.vue";
import procsFlowchartinsert from "@/views/standardInfo/procsFlowchartinsert.vue";

import qiList from "@/views/standardInfo/qiList.vue"

import prductNListwrhousng from "@/views/standardInfo/prductNListwrhousng.vue";
import bomManage from "@/views/standardInfo/bomManage.vue";
import prductNList from "@/views/standardInfo/prductNList.vue"
import prductNdlivyList from "@/views/standardInfo/prduct_n_dlivy.vue"
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
    }, 
    {
        path: 'prductNListwrhousng',
        name: 'prductNListwrhousng',
        component: prductNListwrhousng
    },
    {
        path: 'bomManage',
        name: 'bomManage',
        component: bomManage
    },
    {
        path: 'qiList',
        name: 'qiList',
        component: qiList
    }, 
    {
        path: 'prductNList',
        name: 'prductNList',
        component: prductNList
    },
    {
        path: 'prductNdlivyList',
        name: 'prductNdlivyList',
        component: prductNdlivyList
    },
    {
        path: 'prductNDlivyModar',
        name: 'prductNDlivyModar',
        component: prductNDlivyModar
    },
    {
        path: 'qiList',
        name: 'qiList',
        component: qiList
    }
];

export default standardInfoRoute;
